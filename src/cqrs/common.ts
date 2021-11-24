import { Maybe } from '@fop-ts/core/types'

export type CommandOrQueryBaseMeta = {
  transactionId: string
  createdAt: Date
  userId: Maybe<string>
  parentTransactionId?: string
}

export type CommandOrQuery<Type extends string, Data extends Record<string, any>, R> = {
  _result?: R
  type: Type
  data: Data
  meta: CommandOrQueryBaseMeta
}

export type CommandQueryHandler<CQ extends CommandOrQuery<any, any, R>, R> = (query: CQ) => Promise<R>


