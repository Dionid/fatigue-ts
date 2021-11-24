import { Deferred } from '@fop-ts/core/deferred'
import {FullEvent, FullEventHandler} from "../eda/full-event";

export type EventBusInMemoryPersistor = {
  saveEvent: <E extends FullEvent>(event: E) => Promise<E>
}

export type EventBusInMemory = {
  tx: boolean
  storedEvents: FullEvent[]
  eventHandlers: Record<string, Array<FullEventHandler<any>>>
  onError: (e: any) => void
  persistor?: EventBusInMemoryPersistor
  log?: (...args: any) => void
}

export const create = (
  props: {
    tx?: boolean
    storedEvents?: FullEvent[]
    eventHandlers?: Record<string, Array<FullEventHandler<any>>>
    persistor?: EventBusInMemoryPersistor
    onError?: (e: any) => void
    log?: (...args: any) => void
  } = {}
): EventBusInMemory => {
  return {
    tx: props.tx || false,
    onError:
      props.onError ||
      ((e) => {
        throw e
      }),
    storedEvents: props.storedEvents || [],
    eventHandlers: props.eventHandlers || {},
    persistor: props.persistor,
    log: props.log
  } as EventBusInMemory
}

export const unsubscribe = async <E extends Event>(
  ebim: EventBusInMemory,
  eventName: E['name'],
  eventHandler: FullEventHandler<FullEvent<E>>
): Promise<EventBusInMemory> => {
  if (ebim.eventHandlers[eventName]) {
    ebim.eventHandlers[eventName] = ebim.eventHandlers[eventName].filter((c) => c === eventHandler)
  }

  return ebim
}

export const subscribe = async <E extends Event>(
  ebim: EventBusInMemory,
  eventName: E['name'],
  eventHandler: FullEventHandler<FullEvent<E>>
): Promise<EventBusInMemory> => {
  if (ebim.eventHandlers[eventName]) {
    ebim.eventHandlers[eventName].push(eventHandler)
  } else {
    ebim.eventHandlers[eventName] = [eventHandler]
  }

  return ebim
}

const dispatch = async (ebim: EventBusInMemory, events: readonly FullEvent[]) => {
  await events.map(async (event) => {
    const handlers = ebim.eventHandlers[event.name]

    if (ebim.persistor) {
      try {
        await ebim.persistor.saveEvent(event)
      } catch (e) {
        ebim.onError(e)
      }
    }

    if (handlers) {
      await handlers.map(async (callback) => {
        try {
          await callback(event)
        } catch (e) {
          ebim.onError(e)
        }
      })
    }
  })
}

export const publish = async <E extends readonly FullEvent[]>(ebim: EventBusInMemory, events: E): Promise<E> => {
  if (ebim.tx) {
    ebim.storedEvents.push(...events)

    return events
  }

  await dispatch(ebim, events)

  return events
}

export const tx = async (ebim: EventBusInMemory): Promise<EventBusInMemory> => {
  return {
    ...ebim,
    tx: true,
    storedEvents: []
  }
}

export const commit = async (ebim: EventBusInMemory): Promise<EventBusInMemory> => {
  if (!ebim.tx) {
    return ebim
  }

  await dispatch(ebim, ebim.storedEvents)

  return {
    ...ebim,
    tx: false,
    storedEvents: []
  }
}

export const rollback = async (ebim: EventBusInMemory): Promise<EventBusInMemory> => {
  if (!ebim.tx) {
    return ebim
  }

  return {
    ...ebim,
    tx: false,
    storedEvents: []
  }
}

export const pull = async <E extends Event>(ebim: EventBusInMemory, eventName: E['name']): Promise<E> => {
  return new Promise((resolve) => {
    const callback: FullEventHandler<FullEvent<E>> = async (event) => {
      resolve(event)
      await unsubscribe(ebim, eventName, callback)
    }

    subscribe<E>(ebim, eventName, callback)
  })
}

export async function* observe<E extends Event>(
  ebim: EventBusInMemory,
  eventName: E['name']
): AsyncGenerator<{ stop: () => void; data: E }, void, unknown> {
  let stop = false
  let deff = Deferred.new<E>()

  const callback: FullEventHandler<E> = async (e) => {
    deff.resolve(e)
    deff = Deferred.new()
  }

  await subscribe<E>(ebim, eventName, callback)

  while (!stop) {
    const event = await deff.promise
    yield {
      stop: () => {
        unsubscribe(ebim, eventName, callback)
        stop = true
      },
      data: event
    }
  }
}

export type EventBusInMemoryBehaviour = typeof EventBusInMemory
export const EventBusInMemory = {
  create,
  unsubscribe,
  subscribe,
  publish,
  pull,
  observe,
  tx,
  commit,
  rollback
}
