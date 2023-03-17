import { Unbrand } from '@fapfop/core/branded'
import { ValidationError } from '../typed-errors'

export type valueOf<T> = T[keyof T]

export type Override<T1, T2> = Omit<T1, keyof T2> & T2

export type JSONPrimitive = string | number | boolean | null | undefined
export type JSONValue = JSONPrimitive | { [x: string]: JSONValue } | JSONValue[]
export type JSONObject = Record<string, JSONValue>
export type JSONArray = JSONValue[]

export type JSONify<T> = T extends Date
  ? number
  : T extends null
  ? null
  : T extends Record<string, unknown>
  ? JSONifyObject<T>
  : T extends boolean
  ? boolean
  : T extends symbol
  ? string
  : Unbrand<T>

export type JSONifyObject<Obj extends Record<string, unknown>> = {
  [Key in keyof Obj]: JSONify<Obj[Key]>
}

export const JSONValue = {
  toRecord: (propName: string, value: JSONValue): Record<string, JSONValue> => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new ValidationError(`${propName} must be record`)
    }

    return value
  },

  isNumericString: (propName: string, value: JSONValue): string => {
    if (typeof value != 'string') {
      throw new ValidationError(`${propName} must be a numeric string`)
    }

    const intValue = parseFloat(value)

    if (isNaN(intValue)) {
      throw new ValidationError(`${propName} must be a numeric string`)
    }

    return intValue.toString()
  },

  isRecordsArrayWithCertainKeysWithStringValues: <T extends string>(
    propName: string,
    value: JSONValue,
    keys: T[]
  ): Record<T, string>[] => {
    if (!Array.isArray(value)) {
      throw new ValidationError(`${propName} must be an array`)
    }

    return value.map((item) => {
      return JSONValue.toRecordWithCertainKeysWithStringValues(propName, item, keys)
    })
  },

  toRecordWithCertainKeysWithStringValues: <T extends string>(
    propName: string,
    value: JSONValue,
    keys: T[]
  ): Record<T, string> => {
    const record = JSONValue.toRecord(propName, value)

    keys.forEach((key) => {
      const value = record[key]

      if (typeof value !== 'string') {
        throw new ValidationError(`${propName} must be record with key with string value`)
      }
    })

    return record as Record<T, string>
  },

  toRecordWithCertainKeysWithCertainStringValues: <T extends string, K extends string>(
    propName: string,
    data: JSONValue,
    keys: T[],
    values: K[]
  ): Record<T, K> => {
    const record = JSONValue.toRecord(propName, data)

    keys.forEach((key) => {
      const valueToCheck = record[key]

      if (typeof valueToCheck !== 'string') {
        throw new ValidationError(`${propName} must be record with key with string value`)
      }

      const checkValue = values.some((value) => value === valueToCheck)

      if (!checkValue) {
        throw new ValidationError(`Must be record with key with ${values.join()} value`)
      }
    })

    return record as Record<T, K>
  },

  toUndefined: (propName: string, value: JSONValue): undefined => {
    if (typeof value !== 'undefined') {
      throw new ValidationError(`${propName} must be undefined`)
    }

    return value
  },

  toNull: (propName: string, value: JSONValue): null => {
    if (value !== null) {
      throw new ValidationError(`${propName} must be null`)
    }

    return value
  },

  toNullOrUndefined: (propName: string, value: JSONValue): null | undefined => {
    if (value !== null && value !== undefined) {
      throw new ValidationError(`${propName} must be null`)
    }

    return value
  },

  toString: (propName: string, value: JSONValue): string => {
    if (typeof value !== 'string') {
      throw new ValidationError(`${propName} must be string`)
    }

    return value
  },
  toNotEmptyString: (propName: string, value: JSONValue): string => {
    value = JSONValue.toString(propName, value)

    if (value.length === 0) {
      throw new ValidationError(`${propName} must be not empty string`)
    }

    return value
  },
  toNumberOrNull: (propName: string, value: JSONValue): number | null => {
    if (typeof value !== 'number' && value !== null) {
      throw new ValidationError(`${propName} must be number or null`)
    }

    return value
  },
  toStringOrNull: (propName: string, value: JSONValue): string | null => {
    if (typeof value !== 'string' && value !== null) {
      throw new ValidationError(`${propName} must be string or null`)
    }

    return value
  },
  toStringOrUndefined: (propName: string, value: JSONValue): string | undefined => {
    if (typeof value !== 'string' && value !== undefined) {
      throw new ValidationError(`${propName} must string ot null or undefined`)
    }

    return value
  },
  toStringOrNullOrUndefined: (propName: string, value: JSONValue): string | null | undefined => {
    if (typeof value !== 'string' && value !== null && value !== undefined) {
      throw new ValidationError(`${propName} must string ot null or undefined`)
    }

    return value
  },
  toNumber: (propName: string, value: JSONValue): number => {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      throw new ValidationError(`${propName} must be number`)
    }

    return value
  },
  toArray: (propName: string, value: JSONValue): JSONArray => {
    if (!Array.isArray(value)) {
      throw new ValidationError(`${propName} must be array`)
    }

    return value
  },
  toArrayOfJSONObjects: (propName: string, value: JSONValue): JSONObject[] => {
    const array = JSONValue.toArray(propName, value)

    return array.map((item) => {
      return JSONValue.toJSONObject(propName, item)
    })
  },
  toFloat: (propName: string, value: JSONValue): number => {
    if (value === null || typeof value === 'boolean' || typeof value === 'object' || value === undefined) {
      throw new ValidationError(`${propName} must be float`)
    }

    if (typeof value === 'string') {
      return parseFloat(value)
    } else {
      return value
    }
  },
  toFloatOrUndefined: (propName: string, value: JSONValue): number | undefined => {
    return value === undefined ? value : JSONValue.toFloat(propName, value)
  },
  toFloatOrUndefinedOrNull: (propName: string, value: JSONValue): number | undefined | null => {
    return value === null ? value : JSONValue.toFloatOrUndefined(propName, value)
  },
  toDate: (propName: string, value: JSONValue): Date => {
    if (!value || typeof value === 'boolean' || typeof value === 'object') {
      throw new ValidationError(`${propName} must be Date`)
    }

    return new Date(value)
  },
  toDateOrUndefined: (propName: string, value: JSONValue): Date | undefined => {
    return value === undefined ? value : JSONValue.toDate(propName, value)
  },
  toDateOrUndefinedOrNull: (propName: string, value: JSONValue): Date | null | undefined => {
    return value === null ? value : JSONValue.toDateOrUndefined(propName, value)
  },
  toJSONObject: (propName: string, value: JSONValue): JSONObject => {
    if (typeof value !== 'object' || Array.isArray(value) || value === null) {
      throw new ValidationError(`${propName} item must be JSON object`)
    }

    return value
  },
  toJSONObjectOrUndefined: (propName: string, value: JSONValue): JSONObject | undefined => {
    return value === undefined ? value : JSONValue.toJSONObject(propName, value)
  },
  toBoolean: (propName: string, value: JSONValue): boolean => {
    if (typeof value !== 'boolean') {
      throw new ValidationError(`${propName} must be boolean`)
    }

    return value
  }
}

export const TypeChecker = {
  isNumeric(value: unknown): value is number {
    if (value instanceof Number) {
      value = value.valueOf()
    } // If this is a number object, then we take the value, which will be the number

    const parsedNumber = parseFloat(String(value))
    return !isNaN(parsedNumber) && isFinite(parsedNumber)
  },
  isBoolean(data: unknown): data is boolean {
    return data === 0 || data === 1 || data === '1' || data === '0' || data === true || data === false
  }
}

export type ValidateJSONObject = (propName: string, val: JSONValue) => Promise<JSONValue> | JSONValue

export type JSONObjectValidator<ReqParams extends JSONObject> = {
  [K in keyof ReqParams]: ReqParams[K] extends JSONObject ? JSONObjectValidator<ReqParams[K]> : ValidateJSONObject
}
