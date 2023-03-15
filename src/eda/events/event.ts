import { v4 } from 'uuid'

export type EventMessage<Name extends string, Payload extends Record<any, any>, Meta extends Record<any, any>> = {
  id: string
  name: Name
  payload: Payload
  meta: Meta
}

export type Event<Name extends string, EM extends EventMessage<Name, any, any>> = {
  (...args: any[]): EM
  eventName: Name
}

export const Event = <Name extends string, EM extends EventMessage<Name, any, any>>(name: Name): Event<Name, EM> => {
  const fn = (event: Omit<EM, 'id' | 'name'>) => {
    return {
      id: v4(),
      name,
      ...event
    } as EM
  }

  fn.eventName = name

  return fn
}

export type MessageFromEvent<E extends Event<any, any>> = E extends Event<any, infer EM> ? EM : never
export type MessagePayloadFromEvent<E extends Event<any, any>> = E extends Event<any, infer EM> ? EM['payload'] : never

export type EventsRecord = Record<string, Event<string, any>>
