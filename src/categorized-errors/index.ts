export const INTERNAL_ERROR_TYPE = 'internal_error'

export const INTERNAL_ERROR = {
  type: INTERNAL_ERROR_TYPE,
  message: 'Internal error'
}
export const CRITICAL_ERROR = {
  type: 'critical_error',
  message: 'Critical error'
}
export const DATA_SOURCE_ERROR = {
  type: 'data_source_error',
  message: 'Data source error'
}
export const PERMISSION_ERROR = {
  type: 'permission_error',
  message: 'Permission denied'
}
export const VALIDATION_ERROR = {
  type: 'validation_error',
  message: 'Validation error'
}
export const BAD_REQUEST_ERROR = {
  type: 'bad_request',
  message: 'Bad request error'
}
export const NOT_FOUND_ERROR = {
  type: 'not_found',
  message: 'Not found'
}
export const METHOD_NOT_ALLOWED_ERROR = {
  type: 'method_not_allowed',
  message: 'Method not allowed'
}

export const RESOURSE_NOT_FOUND_ERROR = {
  type: 'recourse_not_found',
  message: 'Resource not found'
}

export const ERRORS = {
  INTERNAL_ERROR,
  CRITICAL_ERROR,
  PERMISSION_ERROR,
  VALIDATION_ERROR,
  NOT_FOUND_ERROR,
  RESOURSE_NOT_FOUND_ERROR
}

export abstract class BaseError extends Error {
  protected constructor(message: string, public statusCode: number, public type: string) {
    super(message)
  }
}

// . Accessibility errors
export class PublicError extends BaseError {
  internalMessage: string

  constructor(publicMessage: string, statusCode: number, type: string, internalMessage?: string) {
    super(publicMessage, statusCode, type)
    this.internalMessage = internalMessage || publicMessage
  }
}
export class InternalError extends BaseError {
  constructor(message: string, type: string = INTERNAL_ERROR.type) {
    super(message, 500, type)
  }
}

export class ArrayReturnedUndefinedError extends BaseError {
  constructor(message: string = 'Array has undefined', type: string = INTERNAL_ERROR.type) {
    super(message, 500, type)
  }
}

// . STATUS ERROR
// .. INTERNAL
export class CriticalError extends InternalError {
  constructor(message: string, type: string = CRITICAL_ERROR.type) {
    super(message, type)
  }
}

export class DataSourceError extends InternalError {
  constructor(message: string, type: string = DATA_SOURCE_ERROR.type) {
    super(message, type)
  }
}

// .. PUBLIC
export class ValidationError extends PublicError {
  constructor(
    message: string = VALIDATION_ERROR.message,
    type: string = VALIDATION_ERROR.type,
    public params?: any[],
    internalMessage?: string
  ) {
    super(message, 400, type, internalMessage)
  }
}

export class BadRequestError extends PublicError {
  constructor(
    message: string = BAD_REQUEST_ERROR.message,
    type: string = BAD_REQUEST_ERROR.type,
    public params?: any[],
    internalMessage?: string
  ) {
    super(message, 402, type, internalMessage)
  }
}

export class PermissionDeniedError extends PublicError {
  constructor(
    message: string = PERMISSION_ERROR.message,
    type: string = PERMISSION_ERROR.type,
    internalMessage?: string
  ) {
    super(message, 403, type, internalMessage)
  }
}

export class NotFoundError extends PublicError {
  constructor(
    message: string = NOT_FOUND_ERROR.message,
    type: string = NOT_FOUND_ERROR.type,
    internalMessage?: string
  ) {
    super(message, 404, type, internalMessage)
  }
}

export class MethodNotAllowedError extends PublicError {
  constructor(
    message: string = METHOD_NOT_ALLOWED_ERROR.message,
    type: string = METHOD_NOT_ALLOWED_ERROR.type,
    internalMessage?: string
  ) {
    super(message, 405, type, internalMessage)
  }
}
