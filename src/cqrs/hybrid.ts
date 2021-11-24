import {Maybe} from "@fop-ts/core/types";
import {v4} from "uuid";
import {CommandOrQuery, CommandQueryHandler} from "./common";

export type Hybrid<Type extends string, Data extends Record<string, any>, R> = CommandOrQuery<Type, Data, R>

export const create = <H extends Hybrid<any, any, any>>(props: {
  type: H['type']
  data: H['data']
  userId: Maybe<string>
  transactionId?: string
  parentTransactionId?: string
  createdAt?: Date
}): Hybrid<H['type'], H['data'], H['_result']> => {
  return {
    data: props.data,
    type: props.type,
    meta: {
      transactionId: props.transactionId || v4(),
      userId: props.userId,
      parentTransactionId: props.parentTransactionId,
      createdAt: props.createdAt || new Date()
    }
  }
}

export const createBehavior = <H extends Hybrid<any, any, any>>(type: H['type']) => {
  return {
    create: (
      data: H['data'],
      meta: {
        userId: Maybe<string>
        transactionId?: string
        parentTransactionId?: string
        createdAt?: Date
      }
    ): Hybrid<H['type'], H['data'], H['_result']> => {
      return create({
        type,
        data,
        ...meta
      })
    },
    type
  }
}

export const Hybrid = {
  create,
  createBehavior,
}

// TODO. Move to FOP
type NonUndefined<T> = Exclude<T, undefined>

export type HybridHandler<HybridCmd extends Hybrid<any, any, any>> = CommandQueryHandler<
  HybridCmd,
  NonUndefined<HybridCmd['_result']>
>
