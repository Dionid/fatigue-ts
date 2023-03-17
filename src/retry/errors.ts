import { InternalError } from '../typed-errors'

export class TooManyRetries extends InternalError {
  retryError: string

  constructor(retryError: unknown) {
    super('Too many retries')

    this.retryError = JSON.stringify(retryError, Object.getOwnPropertyNames(retryError))
  }
}
