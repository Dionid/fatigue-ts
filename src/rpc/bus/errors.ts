export class CallSubscriberNotFoundError extends Error {
  constructor(name: string) {
    super(`Call subscriber hasn't been found for ${name}`)
  }
}
