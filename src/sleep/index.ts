export const Sleep = (ms: number) => {
  return new Promise((res) => setTimeout(res, ms))
}

export const error = (ms: number, error?: Error) => {
  return new Promise((_, rej) => setTimeout(() => rej(error), ms))
}

Sleep.error = error
