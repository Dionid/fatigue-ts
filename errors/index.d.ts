export declare class CodeError extends Error {
    code?: string;
    constructor(message: string, code?: string);
}
export declare class PublicError extends CodeError {
    internalMessage: string;
    constructor(publicMessage: string, internalMessage?: string, code?: string);
}
export declare class InternalError extends CodeError {
}
export declare class CriticalError extends InternalError {
}
export declare class ValidationError extends PublicError {
}
export declare class PermissionDeniedError extends PublicError {
}
export declare class NotFoundError extends PublicError {
}
export declare class UnauthorizedError extends PermissionDeniedError {
    constructor();
}
export declare const throwOnUndefined: <T>(error: Error, value: T | undefined) => T;
export declare const throwOnError: <T>(value: T, fn?: ((prevErr: Error) => Error) | undefined) => Exclude<T, Error>;
export declare const throwOnErrorC: (fn?: ((prevErr: Error) => Error) | undefined) => <T>(value: T) => Exclude<T, Error>;
export declare const returnOnThrow: <R>(callback: () => Promise<R>) => Promise<Error | R>;
