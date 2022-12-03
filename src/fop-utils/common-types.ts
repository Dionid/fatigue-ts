import { Branded } from '@fapfop/core/Branded'
import * as uuid from 'uuid'
import { v4 } from 'uuid'
import { ValidationError } from '../typed-errors'

export const UUIDSymbol = Symbol()
export type UUID = Branded<string, typeof UUIDSymbol>
export const UUID = {
  ofString: (value: string) => {
    return !uuid.validate(value) ? new ValidationError('not valid uuid') : (value as UUID)
  },
  create: () => {
    return UUID.ofString(v4()) as UUID
  }
}
