import { v4 } from 'uuid'
import { CallRequest, CallResponse } from './call'

// # CALL CONSTRUCTOR

export type EitherCallResultFailureDefault<Data extends Record<any, any> | undefined = undefined> = {
  code: string
  message: string
  data?: Data
}

export type EitherCallResponseResult<
  Success extends Record<any, any>,
  Failure extends EitherCallResultFailureDefault = EitherCallResultFailureDefault
> = { $case: 'success'; success: Success } | { $case: 'failure'; failure: Failure }

type EitherCall<
  Name extends string,
  Meta extends Record<any, any>,
  RequestParams extends Record<any, any>,
  Success extends Record<any, any>,
  Failure extends EitherCallResultFailureDefault = EitherCallResultFailureDefault
> = {
  name: Name
  request: (params: RequestParams, meta: Meta) => CallRequest<Name, RequestParams, Meta>
  response: (
    requestOrId: string | CallRequest<Name, RequestParams, Meta>,
    result: EitherCallResponseResult<Success, Failure>,
    meta: Meta
  ) => CallResponse<EitherCallResponseResult<Success, Failure>, Meta>
  success: (
    requestOrId: string | CallRequest<Name, RequestParams, Meta>,
    success: Success,
    meta: Meta
  ) => CallResponse<{ $case: 'success'; success: Success }, Meta>
  failure: (
    requestOrId: string | CallRequest<Name, RequestParams, Meta>,
    failure: Failure,
    meta: Meta
  ) => CallResponse<{ $case: 'failure'; failure: Failure }, Meta>
}

export const EitherCall = <
  Name extends string,
  Meta extends Record<any, any>,
  Params extends Record<any, any>,
  Success extends Record<any, any>,
  Failure extends EitherCallResultFailureDefault = EitherCallResultFailureDefault
>(
  name: Name,
  metaConstructor: (meta?: Partial<Meta>) => Meta
): EitherCall<Name, Meta, Params, Success, Failure> => {
  return {
    name,
    request: (params: Params, meta?: Partial<Meta>): CallRequest<Name, Params, Meta> => {
      const id = v4()
      return {
        id,
        name,
        params,
        meta: metaConstructor(meta)
      }
    },
    response: (
      requestOrId: string | CallRequest<Name, Params, Meta>,
      result: EitherCallResponseResult<Success, Failure>,
      meta?: Partial<Meta>
    ) => {
      const isString = typeof requestOrId === 'string'

      return {
        id: isString ? requestOrId : requestOrId.id,
        result,
        meta: metaConstructor(meta)
      }
    },
    success: (requestOrId: string | CallRequest<Name, Params, Meta>, success: Success, meta?: Partial<Meta>) => {
      const isString = typeof requestOrId === 'string'

      return {
        id: isString ? requestOrId : requestOrId.id,
        result: { $case: 'success', success },
        meta: metaConstructor(meta)
      }
    },
    failure: (requestOrId: string | CallRequest<Name, Params, Meta>, failure: Failure, meta?: Partial<Meta>) => {
      const isString = typeof requestOrId === 'string'

      return {
        id: isString ? requestOrId : requestOrId.id,
        result: { $case: 'failure', failure },
        meta: metaConstructor(meta)
      }
    }
  }
}

// USAGE

type ExampleEitherCallMeta = {
  traceId: string
  ts: number
  sub?: string
  sid?: string
}

type ExampleEitherCall<
  Name extends string,
  RequestParams extends Record<any, any>,
  Success extends Record<any, any>,
  Failure extends EitherCallResultFailureDefault = EitherCallResultFailureDefault
> = EitherCall<Name, ExampleEitherCallMeta, RequestParams, Success, Failure>

export const ExampleEitherCall = <
  Name extends string,
  Params extends Record<any, any>,
  Success extends Record<any, any>,
  Failure extends EitherCallResultFailureDefault = EitherCallResultFailureDefault
>(
  name: Name
) => {
  return EitherCall<Name, ExampleEitherCallMeta, Params, Success, Failure>(name, (meta) => {
    return {
      traceId: meta?.traceId ?? v4(),
      ts: meta?.ts ?? Date.now(),
      sub: meta?.sub,
      sid: meta?.sid
    }
  })
}
