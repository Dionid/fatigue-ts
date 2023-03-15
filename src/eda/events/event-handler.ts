import { Event, MessageFromEvent } from './event'

export type EventHandlerRun<E extends Event<any, any>, Ctx extends Record<any, any>> = (
  message: MessageFromEvent<E>,
  ctx: Ctx
) => Promise<void>

export type EventHandler<E extends Event<any, any>, Ctx extends Record<any, any>> = {
  run: EventHandlerRun<E, Ctx>
  isEventHandler: true
  event: E
  handlerName: string
}

export const EventHandler = <E extends Event<string, any>, Ctx extends Record<any, any>>(props: {
  event: E
  handlerName?: string
  run: EventHandlerRun<E, Ctx>
}): EventHandler<E, Ctx> => {
  return {
    run: props.run,
    event: props.event,
    isEventHandler: true as const,
    handlerName: props.handlerName ?? `${props.event.name}EventHandler`
  }
}
