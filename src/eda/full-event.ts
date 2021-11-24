import { Maybe } from '@fop-ts/core/Types'
import { v4 } from 'uuid'
import { Event } from './event'

export type FullEventMeta = {
  userId: Maybe<string>
  id: string
  rootTransactionId: string
  createdAt: Date
}

export type FullEvent<E extends Event = Event> = E & {
  meta: FullEventMeta
}

export const ofEvent = <E extends Event>(props: {
  event: E
  id?: string
  createdAt?: Date
  userId: Maybe<string>
  rootTransactionId?: string
}): FullEvent<E> => {
  const id = props.id || v4()

  return {
    ...props.event,
    meta: {
      id,
      createdAt: props.createdAt || new Date(),
      userId: props.userId,
      rootTransactionId: props.rootTransactionId || id
    }
  }
}
export const ofParentEvent = <E extends Event>(props: {
  event: E
  parentEvent: FullEvent
  id?: string
  createdAt?: Date
}): FullEvent<E> => {
  return {
    ...props.event,
    meta: {
      id: props.id || v4(),
      createdAt: props.createdAt || new Date(),
      userId: props.parentEvent.meta.userId,
      rootTransactionId: props.parentEvent.meta.rootTransactionId
    }
  }
}
export const ofCmdOrQuery = <E extends Event>(props: {
  event: E
  meta: { userId: Maybe<string>; transactionId: string }
  id?: string
  createdAt?: Date
}): FullEvent<E> => {
  const id = props.id || v4()

  return {
    ...props.event,
    meta: {
      id,
      createdAt: props.createdAt || new Date(),
      userId: props.meta.userId,
      rootTransactionId: props.meta.transactionId || id
    }
  }
}

export const mapEventsFromCmdOrQuery = (meta: { userId: Maybe<string>; transactionId: string }, events: Event[]) => {
  return events.map((event) => ofCmdOrQuery({ event, meta }))
}

export const FullEvent = {
  ofEvent,
  ofParentEvent,
  ofCmdOrQuery,
  mapEventsFromCmdOrQuery
}

export type FullEventHandler<E extends FullEvent<any>> = (event: E) => Promise<void>
