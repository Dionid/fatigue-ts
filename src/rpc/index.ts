import { v4 } from 'uuid'

export type Call<
  Name,
  Req extends { name: string; id: string; params?: any },
  Res extends {
    id: string
    result?: { $case: 'success'; success: any } | { $case: 'failure'; failure: any }
  }
> = {
  name: Name

  request: (params: Req extends { params?: infer Params } ? Params : never) => Req & { name: Name }

  response: (
    props:
      | {
          id: string
          result: Res extends { result?: infer Result } ? Result : never
        }
      | {
          req: Req
          result: Res extends { result?: infer Result } ? Result : never
        }
  ) => Res

  success: (
    props:
      | {
          id: string
          success: Res extends {
            result?: { $case: 'success'; success: infer Success } | { $case: 'failure'; failure: any }
          }
            ? Success
            : never
        }
      | {
          req: Req
          success: Res extends {
            result?: { $case: 'success'; success: infer Success } | { $case: 'failure'; failure: any }
          }
            ? Success
            : never
        }
  ) => Res

  failure: (
    props:
      | {
          id: string
          failure: Res extends {
            result?: { $case: 'failure'; failure: infer Failure } | { $case: 'success'; success: any }
          }
            ? Failure
            : never
        }
      | {
          req: Req
          failure: Res extends {
            result?: { $case: 'failure'; failure: infer Failure } | { $case: 'success'; success: any }
          }
            ? Failure
            : never
        }
  ) => Res
}

export const Call = <
  Name,
  Req extends { name: string; id: string; params?: any },
  Res extends {
    id: string
    result?: { $case: 'success'; success: any } | { $case: 'failure'; failure: any }
  }
>(
  name: Name
): Call<Name, Req, Res> => {
  return {
    name,
    request: (params: Req extends { params?: infer Params } ? Params : never): Req & { name: Name } => {
      return {
        name,
        id: v4(),
        params
      } as Req & { name: Name }
    },
    response: (
      props:
        | {
            id: string
            result: Res extends { result?: infer Result } ? Result : never
          }
        | {
            req: Req
            result: Res extends { result?: infer Result } ? Result : never
          }
    ): Res => {
      const { result } = props

      if ('req' in props) {
        return {
          id: props.req.id,
          result
        } as Res
      } else {
        return {
          id: props.id,
          result
        } as Res
      }
    },
    success: (
      props:
        | {
            id: string
            success: Res extends {
              result?: { $case: 'success'; success: infer Success } | { $case: 'failure'; failure: any }
            }
              ? Success
              : never
          }
        | {
            req: Req
            success: Res extends {
              result?: { $case: 'success'; success: infer Success } | { $case: 'failure'; failure: any }
            }
              ? Success
              : never
          }
    ): Res => {
      const { success } = props

      if ('req' in props) {
        return {
          id: props.req.id,
          result: {
            $case: 'success',
            success
          }
        } as Res
      } else {
        return {
          id: props.id,
          result: {
            $case: 'success',
            success
          }
        } as Res
      }
    },
    failure: (
      props:
        | {
            id: string
            failure: Res extends {
              result?: { $case: 'failure'; failure: infer Failure } | { $case: 'success'; success: any }
            }
              ? Failure
              : never
          }
        | {
            req: Req
            failure: Res extends {
              result?: { $case: 'failure'; failure: infer Failure } | { $case: 'success'; success: any }
            }
              ? Failure
              : never
          }
    ): Res => {
      const { failure } = props

      if ('req' in props) {
        return {
          id: props.req.id,
          result: {
            $case: 'failure',
            failure
          }
        } as Res
      } else {
        return {
          id: props.id,
          result: {
            $case: 'failure',
            failure
          }
        } as Res
      }
    }
  }
}

// # FROM CALL

export type RequestFromCall<C extends Call<any, any, any>> = ReturnType<C['request']>

export type RequestParamsFromCall<C extends Call<any, any, any>> = ReturnType<C['request']>['params']

export type SuccessResponseFromCall<C extends Call<any, any, any>> = ReturnType<C['response']>['response']['success']

export type FailureResponseFromCall<C extends Call<any, any, any>> = ReturnType<C['response']>['response']['failure']

export type ResponseFromCall<C extends Call<any, any, any>> = ReturnType<C['response']>

// # CALL HANDLER

export type CallHandler = <C extends Call<any, any, any>>(request: RequestFromCall<C>) => Promise<C>
