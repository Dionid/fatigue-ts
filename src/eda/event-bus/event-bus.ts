import { Event, EventsRecord, MessageFromEvent } from '../events'

export type PublishEvent<E extends Event<any, any>> = (event: MessageFromEvent<E>) => Promise<void>

export type EventsToPublish<BEs extends EventsRecord> = {
  [K in keyof BEs]: PublishEvent<BEs[K]>
}

export type EventsPublisher<ER extends EventsRecord> = {
  publish: <E extends Event<any, any>>(event: MessageFromEvent<E>) => Promise<void>
} & EventsToPublish<ER>

export const bindEventBusToEvents = <ER extends EventsRecord>(
  publishEvent: <E extends Event<any, any>>(event: MessageFromEvent<E>) => Promise<void>,
  callsRecord: ER
): EventsToPublish<ER> => {
  return Object.keys(callsRecord).reduce<EventsToPublish<ER>>((acc, cur) => {
    const callName = cur as keyof ER

    acc[callName] = (eventMessage) => {
      return publishEvent(eventMessage)
    }

    return acc
  }, {} as EventsToPublish<ER>)
}

export type EventBus<Ctx extends Record<any, any>, ER extends EventsRecord> = {
  init: () => Promise<void>
  stop: () => Promise<void>
  restart: () => Promise<void>
  destroy: () => Promise<void>
  ctx: () => Ctx
  event: EventsPublisher<ER>
}
