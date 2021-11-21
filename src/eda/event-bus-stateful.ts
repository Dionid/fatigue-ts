import {Event} from "./event";
import {FullEvent, FullEventHandler} from "./full-event";

export type EventBusSF = {
  unsubscribe<E extends Event<any, any, any>>(
    eventName: E['name'],
    eventHandler: FullEventHandler<FullEvent<E>>
  ): Promise<EventBusSF>
  subscribe<E extends Event<any, any, any>>(
    eventName: E['name'],
    eventHandler: FullEventHandler<FullEvent<E>>
  ): Promise<EventBusSF>
  publish(events: readonly FullEvent[]): Promise<void>
  pull<E extends Event<any, any, any>>(eventName: E['name']): Promise<E>
  observe<E extends Event<any, any, any>>(
    eventName: E['name']
  ): AsyncGenerator<{ stop: () => void; data: E }, void, unknown>
  tx(): Promise<EventBusSF>
  commit(): Promise<EventBusSF>
  rollback(): Promise<EventBusSF>
}
