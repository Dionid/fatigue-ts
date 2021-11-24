import {Maybe} from "@fop-ts/core/types";
import {v4} from "uuid";
import {CommandOrQuery, CommandQueryHandler} from "./common";


export type Command<Type extends string, Data extends Record<string, any>> = CommandOrQuery<Type, Data, undefined>

export const create = <Type extends string, Data extends Record<string, any>>(props: {
  type: Type
  data: Data
  userId: Maybe<string>
  transactionId?: string
  parentTransactionId?: string
  createdAt?: Date
}): Command<Type, Data> => {
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

export const createBehavior = <Cmd extends Command<any, any>>(type: Cmd['type']) => {
  return {
    create: (
      data: Cmd['data'],
      meta: {
        userId: Maybe<string>
        transactionId?: string
        parentTransactionId?: string
        createdAt?: Date
      }
    ): Command<Cmd['type'], Cmd['data']> => {
      return create({
        type,
        data,
        ...meta
      })
    },
    type
  }
}

export const Command = {
  create,
  createBehavior
}

export type CommandHandler<Cmd extends Command<any, any>> = CommandQueryHandler<Cmd, void>
