import { BrandedPrimitive } from 'functional-oriented-programming-ts';
import { ValidationError } from '../errors';
export declare type UUID = BrandedPrimitive<string, {
    readonly UUID: unique symbol;
}>;
export declare const UUID: {
    ofString: (value: string) => ValidationError | UUID;
    new: () => UUID;
};
