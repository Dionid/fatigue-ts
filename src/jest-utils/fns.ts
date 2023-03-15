import { MaybeMocked } from 'ts-jest/dist/utils/testing'

export const clearMockedBehaviorRecord = (behavior: MaybeMocked<Record<string, (...args: any[]) => any>>) => {
  Object.values(behavior).forEach((fn) => {
    fn.mockClear()
  })
}
