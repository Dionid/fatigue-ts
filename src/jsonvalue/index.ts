import { ValidationError } from '../typed-errors'

export type valueOf<T> = T[keyof T]

export type Override<T1, T2> = Omit<T1, keyof T2> & T2

export type OptionalRecord<K extends keyof any, T> = {
  [P in K]?: T
}

export type OptionalEntity<T extends Record<any, any>> = {
  [P in keyof T]?: T[P]
}

export type JSONPrimitive = string | number | boolean | null | undefined
export type JSONValue = JSONPrimitive | JSONObject | JSONArray
export type JSONObject = { [member: string]: JSONValue }
export type JSONArray = JSONValue[]

export const JSONValue = {
  toRecord: (propName: string, value: JSONValue): Record<string, any> => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new ValidationError(`${propName} must be record`)
    }

    return value
  },

  isNumericString: (propName: string, value: JSONValue): string => {
    if (typeof value !== 'string') {
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
  ): Array<Record<T, string>> => {
    if (!Array.isArray(value)) {
      throw new ValidationError(`${propName} must be an array`)
    }

    const array = value.map((item) => {
      return JSONValue.toRecordWithCertainKeysWithStringValues(propName, item, keys)
    })

    return array
  },

  toRecordWithCertainKeysWithStringValues: <T extends string>(
    propName: string,
    value: JSONValue,
    keys: T[]
  ): Record<T, string> => {
    const record = JSONValue.toRecord(propName, value)

    keys.forEach((key) => {
      const val = record[key]

      if (typeof val !== 'string') {
        throw new ValidationError(`${propName} must be record with key with string value`)
      }
    })

    return record
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

    return record
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
      throw new ValidationError(`${propName} must be JSON object`)
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

export const TypeCheker = {
  isNumeric(value: any): value is number {
    if (value instanceof Number) {
      value = value.valueOf()
    } // Если это объект числа, то берём значение, которое и будет числом

    return !isNaN(parseFloat(value)) && isFinite(value)
  },
  isBoolean(data: any): data is boolean {
    // let number = parseInt(data);
    if (data === 0 || data === 1 || data === '1' || data === '0' || data === true || data === false) {
      return true
    } else {
      return false
    }
  }
}
