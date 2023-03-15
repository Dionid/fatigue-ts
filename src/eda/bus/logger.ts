export type Logger = {
  info: (...prop: any[]) => any
  warn: (...prop: any[]) => any
  error: (...prop: any[]) => any
  child?: (...props: any[]) => Logger
}
