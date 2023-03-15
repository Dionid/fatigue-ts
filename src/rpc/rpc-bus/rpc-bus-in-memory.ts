import {
  Call,
  CallHandler,
  CallHandlerRun,
  CallRequest,
  CallsRecord,
  RequestFromCall,
  ResponseFromCall
} from '../calls'
import { CallSubscriberNotFoundError } from './errors'
import { Logger } from './logger'
import { bindRpcBusToCalls, CallsToPublish, RpcBus } from './rpc-bus'

export const InMemoryRpcBusName = 'InMemoryRpcBus'

export type InMemoryRpcBus<Ctx extends Record<any, any>, CR extends CallsRecord> = RpcBus<Ctx, CR> & {
  checkCallHandlerExist: (callName: string) => boolean
  getCallSub: (callName: string) => CallHandler<any, any> | undefined
}

export const InMemoryRpcBus = <Ctx extends Record<any, any>, CR extends CallsRecord>(
  props: {
    ctx?: () => Ctx
    logger?: Logger
    callsToPublish?: CR
  } = {}
): InMemoryRpcBus<Ctx, CR> => {
  const ctx = () => {
    return props.ctx ? props.ctx() : ({} as Ctx)
  }

  const { callsToPublish } = props

  // # Logger
  let logger: Logger = props.logger ?? {
    info: console.log,
    error: console.error,
    warn: console.warn,
    child: () => {
      return console
    }
  }

  if (logger.child) {
    logger = logger.child({
      dfRpcBus: InMemoryRpcBusName
    })
  }

  // # Subscribe maps
  let callSubscribersMap: Record<string, CallHandler<any, Ctx>> = {}

  // # PUBLISH CALL

  const publishCall = async <C extends Call<any, any, CallRequest<string, any, any>, any>>(
    callRequest: RequestFromCall<C>
  ): Promise<ResponseFromCall<C>> => {
    const callSubscriber = callSubscribersMap[callRequest.name] as CallHandler<C, Ctx> | undefined

    if (!callSubscriber) {
      throw new CallSubscriberNotFoundError(callRequest.name)
    }

    return callSubscriber.run(callRequest, ctx())
  }

  const transportAssignedCalls: CallsToPublish<CR> = bindRpcBusToCalls(publishCall, callsToPublish ?? ({} as CR))

  return {
    // # INIT
    init: async () => {
      return
    },
    stop: async () => {
      return
    },
    restart: async () => {
      return
    },
    destroy: async () => {
      callSubscribersMap = {}
    },

    ctx,

    // UTILS

    checkCallHandlerExist: (callName: string) => {
      return !!callSubscribersMap[callName]
    },
    getCallSub: (callName: string) => {
      return callSubscribersMap[callName]
    },

    // # CALL
    call: {
      publish: publishCall,
      subscribe: async <C extends Call<string, any, any, any>>(call: C, run: CallHandlerRun<C, Ctx>): Promise<void> => {
        callSubscribersMap[call.name] = CallHandler({
          run,
          call
        })
      },
      subscribeHandler: async (callHandler: CallHandler<Call<string, any, any, any>, Ctx>) => {
        callSubscribersMap[callHandler.call.name] = callHandler

        return
      },
      ...transportAssignedCalls
    }
  }
}
