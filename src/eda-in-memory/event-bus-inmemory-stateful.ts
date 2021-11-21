import {Event, EventBusSF, FullEvent, FullEventHandler} from "../eda";
import {
  commit,
  create,
  EventBusInMemory,
  EventBusInMemoryPersistor,
  observe,
  publish,
  pull,
  rollback,
  subscribe,
  tx,
  unsubscribe
} from "./event-bus-inmemory";

// . SF – stateful
export type EventBusInMemorySF = EventBusSF
export const EventBusInMemorySF = {
  fromEventBusInmemory: (ebim: EventBusInMemory): EventBusSF => {
    return {
      unsubscribe: async <E extends Event<any, any, any>>(
        eventName: E['name'],
        eventHandler: FullEventHandler<FullEvent<E>>
      ) => EventBusInMemorySF.create(await unsubscribe(ebim, eventName, eventHandler)),
      subscribe: async <E extends Event<any, any, any>>(
        eventName: E['name'],
        eventHandler: FullEventHandler<FullEvent<E>>
      ) => EventBusInMemorySF.create(await subscribe(ebim, eventName, eventHandler)),
      publish: async <E extends readonly FullEvent[]>(events: E) => publish<E>(ebim, events),
      pull: async <E extends Event<any, any, any>>(eventName: E['name']) => pull(ebim, eventName),
      observe: <E extends Event<any, any, any>>(eventName: E['name']) => observe(ebim, eventName),
      tx: async () => EventBusInMemorySF.create(await tx(ebim)),
      commit: async () => EventBusInMemorySF.create(await commit(ebim)),
      rollback: async () => EventBusInMemorySF.create(await rollback(ebim))
    }
  },
  create: (props: {
    tx?: boolean
    storedEvents?: FullEvent[]
    eventHandlers?: Record<string, Array<FullEventHandler<any>>>
    persistor?: EventBusInMemoryPersistor
    onError?: (e: any) => void
    log?: (...args: any) => void
  }): EventBusSF => {
    return EventBusInMemorySF.fromEventBusInmemory(create(props))
  }
}
