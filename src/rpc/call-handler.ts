import { Call, RequestFromCall, ResponseFromCall } from './call'

export type CallHandlerRun<C extends Call<any, any, any, any>, Ctx extends Record<any, any>> = (
  request: RequestFromCall<C>,
  ctx: Ctx
) => Promise<ResponseFromCall<C>>

export type CallHandler<C extends Call<any, any, any, any>, Ctx extends Record<any, any>> = {
  run: CallHandlerRun<C, Ctx>
  isCallHandler: true
  call: C
  handlerName: string
}

export const CallHandler = <C extends Call<string, any, any, any>, Ctx extends Record<any, any>>(props: {
  call: C
  handlerName?: string
  run: CallHandlerRun<C, Ctx>
}): CallHandler<C, Ctx> => {
  return {
    run: props.run,
    call: props.call,
    isCallHandler: true as const,
    handlerName: props.handlerName ?? `${props.call.name}CallHandler`
  }
}
