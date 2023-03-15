export class CallSubscriberNotFoundError extends Error {
  constructor(name: string) {
    super(`Call subscriber hasn't been found for ${name}`)
  }
}

export class EventSubscriberNotFoundError extends Error {
  constructor(name: string) {
    super(`Event subscriber hasn't been found for ${name}`)
  }
}
