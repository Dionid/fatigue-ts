import { v4 } from 'uuid'
import { EventMessage } from './event'

export type CustomEvent<Name extends string, Meta extends Record<any, any>, Payload extends Record<any, any>> = {
  (payload: Payload, meta?: Partial<Meta>): EventMessage<Name, Payload, Meta>
  eventName: Name
}

export const CustomEvent = <Name extends string, Meta extends Record<any, any>, Payload extends Record<any, any>>(
  name: Name,
  metaConstructor: (meta?: Partial<Meta>) => Meta
): CustomEvent<Name, Meta, Payload> => {
  const fn = (payload: Payload, meta?: Partial<Meta>) => {
    return {
      id: v4(),
      name,
      payload,
      meta: metaConstructor(meta)
    }
  }

  fn.eventName = name

  return fn
}

// # USAGE

type ExampleEventMeta = {
  traceId: string
  ts: number
  sub?: string
  sid?: string
}

type ExampleEvent<Name extends string, Payload extends Record<any, any>> = CustomEvent<Name, Payload, ExampleEventMeta>

export const ExampleEvent = <Name extends string, Payload extends Record<any, any>>(name: Name) => {
  return CustomEvent<Name, ExampleEventMeta, Payload>(name, (meta) => {
    return {
      traceId: meta?.traceId ?? v4(),
      ts: meta?.ts ?? Date.now(),
      sub: meta?.sub,
      sid: meta?.sid
    }
  })
}
