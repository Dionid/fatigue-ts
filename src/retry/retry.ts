import { Sleep } from '@fapfop/core/sleep'
import { TooManyRetries } from './errors'

export const linearTimeoutBetweenCalls = (current: number) => 1000 * current + Math.random() * 100

export const exponentialTimeoutBetweenCalls = (current: number) => 1000 * Math.pow(2, current) + Math.random() * 100

export interface RetryOptions {
  total?: number
  current?: number
  errorLog?: (error: unknown) => unknown
  timeoutBetweenCalls?: (current: number, total: number) => number
  unref?: boolean
}

export const onError = async <R>(fn: () => Promise<R>, options: RetryOptions = {}): Promise<R> => {
  const { total = 5, current = 0, errorLog, timeoutBetweenCalls = linearTimeoutBetweenCalls, unref = true } = options

  try {
    if (current > 0) {
      await Sleep.run(timeoutBetweenCalls(current, total), { unref })
    }

    return await fn()
  } catch (e) {
    if (errorLog) {
      errorLog(e)
    }

    if (current === total) {
      throw new TooManyRetries(e)
    }

    return onError(fn, {
      ...options,
      current: current + 1
    })
  }
}

export const onErrorWrapper =
  <Args extends any[], Result>(fn: (...args: Args) => Promise<Result>, options: RetryOptions = {}) =>
  (...args: Args): Promise<Result> => {
    return onError(() => {
      return fn(...args)
    }, options)
  }
