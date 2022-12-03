const throwOnUndefined = <T>(error: Error, value: T | undefined): T => {
  if (value === undefined) {
    throw error
  }

  return value
}

const throwOnError = <T>(value: T, fn?: (prevErr: Error) => Error): Exclude<T, Error> => {
  if (value instanceof Error) {
    throw fn ? fn(value) : value
  }

  return value as Exclude<T, Error>
}

const throwOnErrorC =
  (fn?: (prevErr: Error) => Error) =>
  <T>(value: T): Exclude<T, Error> => {
    if (value instanceof Error) {
      throw fn ? fn(value) : value
    }

    return value as Exclude<T, Error>
  }

const returnOnThrow = async <R>(callback: () => Promise<R>): Promise<R | Error> => {
  try {
    return await callback()
  } catch (e) {
    if (!(e instanceof Error)) {
      throw e
    }

    return e
  }
}

const rethrow = async <R>(fn: () => R, isInitialType: (e: any) => boolean, newType: (e: any) => Error): Promise<R> => {
  try {
    return await fn()
  } catch (e) {
    if (isInitialType(e)) {
      throw newType(e)
    }

    throw e
  }
}

export const Err = {
  throwOnUndefined,
  throwOnError,
  throwOnErrorC,
  returnOnThrow,
  rethrow
}
