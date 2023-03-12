import { InternalError } from '../typed-errors'
import { Sleep } from '@fapfop/core/sleep'

export class TooManyRetries extends InternalError {
  constructor(public retryError: any) {
    super(`Too many retries`)
  }
}

export type RetryOptions = {
  total?: number
  current?: number
  errorLog?: (error: any) => any
  timeoutBetweenCalls?: number
}

export const run = async <R>(fn: () => R, options: RetryOptions = {}): Promise<R> => {
  const { total = 5, current = 0, errorLog, timeoutBetweenCalls } = options

  try {
    if (current > 0) {
      await Sleep.run((timeoutBetweenCalls || 1000) * current)
    }

    return await fn()
  } catch (e) {
    if (errorLog) {
      errorLog(e)
    }

    if (current === total) {
      throw new TooManyRetries(e)
    }

    return run(fn, {
      ...options,
      current: current + 1
    })
  }
}

export const onErrorWrapper =
  <Args extends any[], Result>(fn: (...args: Args) => Result, options: RetryOptions = {}) =>
  (...args: Args): Promise<Result> => {
    return run(() => {
      return fn(...args)
    }, options)
  }

export const Retry = {
  run,
  onErrorWrapper
}
