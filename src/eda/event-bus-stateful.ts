import { Event } from './event'
import { FullEvent, FullEventHandler } from './full-event'

export type EventBusSF = {
  unsubscribe<E extends Event>(
    eventName: E['name'],
    eventHandler: FullEventHandler<FullEvent<E>>
  ): Promise<EventBusSF>
  subscribe<E extends Event>(
    eventName: E['name'],
    eventHandler: FullEventHandler<FullEvent<E>>
  ): Promise<EventBusSF>
  publish<E extends readonly FullEvent[]>(events: E): Promise<E>
  pull<E extends Event>(eventName: E['name']): Promise<E>
  observe<E extends Event>(
    eventName: E['name']
  ): AsyncGenerator<{ stop: () => void; data: E }, void, unknown>
  tx(): Promise<EventBusSF>
  commit(): Promise<EventBusSF>
  rollback(): Promise<EventBusSF>
}
