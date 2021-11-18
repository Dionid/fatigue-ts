import {MaybeMocked} from "ts-jest/dist/utils/testing";

export const clearMockedBehaviourRecord = (
  behaviour: MaybeMocked<Record<string, (...args: any[]) => any>>
) => {
  Object.values(behaviour).forEach((fn) => {
    fn.mockClear()
  })
}
