export const Sleep = (ms: number) => {
  return new Promise((res) => setTimeout(res, ms))
}

export const error = (ms: number, err?: Error) => {
  return new Promise((_, rej) => setTimeout(() => rej(err), ms))
}

Sleep.error = error
