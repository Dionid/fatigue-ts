import EventEmitter from 'events'

import { Deferred } from '@fapfop/core/deferred'
import { Switch } from '@fapfop/core/switch'
import { v4 } from 'uuid'

import { RequestTimeoutError } from '../typed-errors'

export type LQJob<A> = {
  id: string
  args: A
}

export const LQ = <Args extends any[], Result>(
  fn: (...args: Args) => Promise<Result>,
  options: { timeout?: number } = {}
) => {
  const { timeout = 0 } = options
  let state: 'processing' | 'waiting' = 'waiting'
  const pendingQueue: Array<LQJob<Args>> = []
  const doneEmitter: EventEmitter = new EventEmitter()

  const startProcessing = async (): Promise<void> => {
    state = 'processing'

    const job = pendingQueue.pop()

    if (!job) {
      state = 'waiting'

      return
    }

    try {
      const result = await fn(...job.args)
      doneEmitter.emit(`${job.id}`, {
        $case: 'success',
        result
      })
    } catch (err) {
      doneEmitter.emit(`${job.id}`, {
        $case: 'failure',
        result: err as never
      })
    }

    startProcessing().catch((err) => {
      throw err
    })

    return
  }

  return (...args: Args): Promise<Result> => {
    const job: LQJob<Args> = {
      id: v4(),
      args
    }

    pendingQueue.unshift(job)

    const response = Deferred<Result>()
    let timeoutId: ReturnType<typeof setTimeout>

    if (timeout) {
      timeoutId = setTimeout(() => {
        response.reject(new RequestTimeoutError())
      }, timeout).unref()
    }

    doneEmitter.on(`${job.id}`, (data: { $case: 'success'; result: Result } | { $case: 'failure'; result: Error }) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      const { $case, result } = data

      switch ($case) {
        case 'success':
          response.resolve(result)
          break
        case 'failure':
          response.reject(result)
          break
        default:
          return Switch.safeGuard($case)
      }

      doneEmitter.removeAllListeners(`${job.id}`)

      return
    })

    if (state === 'waiting') {
      startProcessing().catch((err) => {
        throw err
      })
    }

    return response()
  }
}
