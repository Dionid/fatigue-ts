import { Maybe, NonUndefined } from '@fop-ts/core/Types'
import { v4 } from 'uuid'
import { CommandOrQuery, CommandQueryHandler } from './common'

export type Query<Type extends string, Data extends Record<string, any>, R> = CommandOrQuery<Type, Data, R>

export const create = <Type extends string, Data extends Record<string, any>, R>(props: {
  type: Type
  data: Data
  userId: Maybe<string>
  transactionId?: string
  parentTransactionId?: string
  createdAt?: Date
}): Query<Type, Data, R> => {
  return {
    type: props.type,
    data: props.data,
    meta: {
      userId: props.userId,
      transactionId: props.transactionId || v4(),
      parentTransactionId: props.parentTransactionId,
      createdAt: props.createdAt || new Date()
    }
  }
}

export const Query = {
  create
}

export type QueryHandler<Q extends Query<any, any, any>> = CommandQueryHandler<Q, NonUndefined<Q['_result']>>

export const createCurriedType = <Q extends Query<any, any, any>>(type: Q['type']) => {
  return {
    create: (
      data: Q['data'],
      meta: {
        userId: Maybe<string>
        transactionId?: string
        parentTransactionId?: string
        createdAt?: Date
      }
    ): Query<Q['type'], Q['data'], Q['_result']> => {
      return Query.create({
        type,
        data,
        ...meta
      })
    },
    type
  }
}

export const QueryBehavior = {
  createCurriedType
}
