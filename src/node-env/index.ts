export type NodeEnv = 'local' | 'review' | 'development' | 'prod' | 'test'

export const NodeEnv = {
  ofString: (rawVal: string) => {
    const val = rawVal as NodeEnv

    switch (val) {
      case 'development':
      case 'prod':
      case 'local':
      case 'review':
      case 'test':
        return val
      default:
        throw new Error(`Not correct NoeEnv ${String(val)}`)
    }
  }
}
