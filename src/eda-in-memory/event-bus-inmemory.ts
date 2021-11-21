import {Deferred} from '@fop-ts/core'
import {Event, FullEvent, FullEventHandler} from '../eda'

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

export const unsubscribe = async <E extends Event<any, any, any>>(
  ebim: EventBusInMemory,
  eventName: E['name'],
  eventHandler: FullEventHandler<FullEvent<E>>
): Promise<EventBusInMemory> => {
  if (ebim.eventHandlers[eventName]) {
    ebim.eventHandlers[eventName] = ebim.eventHandlers[eventName].filter((c) => c === eventHandler)
  }

  return ebim
}

export const unsubscribeC =
  <E extends Event<any, any, any>>(eventName: E['name'], eventHandler: FullEventHandler<FullEvent<E>>) =>
  async (ebim: EventBusInMemory): Promise<EventBusInMemory> => {
    return unsubscribe(ebim, eventName, eventHandler)
  }

export const subscribe = async <E extends Event<any, any, any>>(
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

export const subscribeC =
  <E extends Event<any, any, any>>(eventName: E['name'], eventHandler: FullEventHandler<FullEvent<E>>) =>
  async (ebim: EventBusInMemory): Promise<EventBusInMemory> => {
    return subscribe(ebim, eventName, eventHandler)
  }

const dispatch = (events: readonly FullEvent[]) => async (ebim: EventBusInMemory) => {
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

export const publish = async (ebim: EventBusInMemory, events: readonly FullEvent[]): Promise<void> => {
  if (ebim.tx) {
    ebim.storedEvents.push(...events)

    return
  }

  await dispatch(events)(ebim)
}

export const publishC =
  (events: readonly FullEvent[]) =>
  async (ebim: EventBusInMemory): Promise<void> => {
    return publish(ebim, events)
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

  await dispatch(ebim.storedEvents)(ebim)

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

export const pull = async <E extends Event<any, any, any>>(
  ebim: EventBusInMemory,
  eventName: E['name']
): Promise<E> => {
  return new Promise((resolve) => {
    const callback: FullEventHandler<FullEvent<E>> = async (event) => {
      resolve(event)
      await unsubscribe(ebim, eventName, callback)
    }

    subscribe<E>(ebim, eventName, callback)
  })
}

export const pullC =
  <E extends Event<any, any, any>>(eventName: E['name']) =>
  (ebim: EventBusInMemory): Promise<E> =>
    pull(ebim, eventName)

export async function* observe<E extends Event<any, any, any>>(
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

export const observeC =
  <E extends Event<any, any, any>>(eventName: E['name']) =>
  (ebim: EventBusInMemory): AsyncGenerator<{ stop: () => void; data: E }, void, unknown> =>
    observe(ebim, eventName)

export type EventBusInMemoryBehaviour = typeof EventBusInMemory
export const EventBusInMemory = {
  create,
  unsubscribe,
  unsubscribeC,
  subscribe,
  subscribeC,
  publish,
  publishC,
  pull,
  pullC,
  observe,
  observeC,
  tx,
  commit,
  rollback
}

