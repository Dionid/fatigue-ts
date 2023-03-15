import { Call, RequestFromCall, ResponseFromCall, CallsRecord } from '../calls'

export type PublishCall<C extends Call<any, any, any, any>> = (
  request: RequestFromCall<C>
) => Promise<ResponseFromCall<C>>

export type CallsToPublish<CR extends CallsRecord> = {
  [K in keyof CR]: PublishCall<CR[K]>
}

export const bindRpcBusToCalls = <CR extends CallsRecord>(
  publishCall: <C extends Call<any, any, any, any>>(request: RequestFromCall<C>) => Promise<ResponseFromCall<C>>,
  callsRecord: CR
): CallsToPublish<CR> => {
  return Object.keys(callsRecord).reduce<CallsToPublish<CR>>((acc, cur) => {
    const callName = cur as keyof CR

    acc[callName] = (callRequest) => {
      return publishCall(callRequest)
    }

    return acc
  }, {} as CallsToPublish<CR>)
}

export type CallsPublisher<CR extends CallsRecord> = {
  publish: <C extends Call<any, any, any, any>>(request: RequestFromCall<C>) => Promise<ResponseFromCall<C>>
} & CallsToPublish<CR>

export type RpcBus<Ctx extends Record<any, any>, CR extends CallsRecord> = {
  init: () => Promise<void>
  stop: () => Promise<void>
  restart: () => Promise<void>
  destroy: () => Promise<void>
  ctx: () => Ctx
  call: CallsPublisher<CR>
}
