import EventEmitter from 'events'

import { Deferred } from '@fapfop/core/Deferred'
import { Switch } from '@fapfop/core/Switch'
import { v4 } from 'uuid'

import { RequestTimeoutError } from '../typed-errors'

export type LQJob<A> = {
  id: string
  args: A
}

export const LQ = <Args extends any[], Result>(fn: (...args: Args) => Result, options: { timeout?: number } = {}) => {
  const { timeout = 0 } = options
  let state: 'processing' | 'waiting' = 'waiting'
  const pendingQueue: Array<LQJob<Args>> = []
  const doneEmmiter: EventEmitter = new EventEmitter()

  const startProcessing = async (): Promise<void> => {
    state = 'processing'

    const job = pendingQueue.pop()

    if (!job) {
      state = 'waiting'

      return
    }

    try {
      const result = await fn(...job.args)
      doneEmmiter.emit(`${job.id}`, {
        $case: 'success',
        result
      })
    } catch (err) {
      doneEmmiter.emit(`${job.id}`, {
        $case: 'failure',
        result: err
      })
    }

    startProcessing()

    return
  }

  return (...args: Args): Promise<Result> => {
    const job: LQJob<Args> = {
      id: v4(),
      args
    }

    pendingQueue.unshift(job)

    const response = Deferred<Result>()
    let timoutId: ReturnType<typeof setTimeout>

    if (timeout) {
      timoutId = setTimeout(() => {
        response.reject(new RequestTimeoutError())
      }, timeout).unref()
    }

    doneEmmiter.on(`${job.id}`, (data: { $case: 'success' | 'failure'; result: any }) => {
      if (timoutId) {
        clearTimeout(timoutId)
      }

      switch (data.$case) {
        case 'success':
          response.resolve(data.result)
          break
        case 'failure':
          response.reject(data.result)
          break
        default:
          return Switch.safeGuard(data.$case)
      }

      doneEmmiter.removeAllListeners(`${job.id}`)

      return
    })

    if (state === 'waiting') {
      startProcessing()
    }

    return response()
  }
}
