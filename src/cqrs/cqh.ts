import { Maybe } from '@fop-ts/core'
import { v4 } from 'uuid'

export type CommandOrQueryBaseMeta = {
  transactionId: string
  createdAt: Date
  userId: Maybe<string>
  parentTransactionId?: string
}

export type CommandOrQuery<Type extends string, Data extends Record<string, any>> = {
  type: Type
  data: Data
  meta: CommandOrQueryBaseMeta
}

export type Query<Type extends string, Data extends Record<string, any>, R> = CommandOrQuery<Type, Data> & {
  _result?: R
}
export const Query = {
  create: <Type extends string, Data extends Record<string, any>, R>(props: {
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
}

export const QueryBehaviorFactory = <Q extends Query<any, any, any>>(type: Q['type']) => {
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

export type Command<Type extends string, Data extends Record<string, any>> = Query<Type, Data, undefined>

export const Command = {
  create: <Type extends string, Data extends Record<string, any>>(props: {
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
}

export const CommandBehaviorFactory = <Cmd extends Command<any, any>>(type: Cmd['type']) => {
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
      return Command.create({
        type,
        data,
        ...meta
      })
    },
    type
  }
}

export type Hybrid<Type extends string, Data extends Record<string, any>, R> = Query<Type, Data, R>
export const Hybrid = {
  create: <H extends Hybrid<any, any, any>>(props: {
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
}

export const HybridBehaviorFactory = <H extends Hybrid<any, any, any>>(type: H['type']) => {
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
      return Hybrid.create({
        type,
        data,
        ...meta
      })
    },
    type
  }
}

type NonUndefined<T> = Exclude<T, undefined>

export type CommandQueryHandler<CQ extends CommandOrQuery<any, any>, R> = (query: CQ) => Promise<R>
export type QueryHandler<Q extends Query<any, any, any>> = CommandQueryHandler<Q, NonUndefined<Q['_result']>>
export type CommandHandler<Cmd extends Command<any, any>> = CommandQueryHandler<Cmd, void>
export type HybridHandler<HybridCmd extends Hybrid<any, any, any>> = CommandQueryHandler<
  HybridCmd,
  NonUndefined<HybridCmd['_result']>
>
