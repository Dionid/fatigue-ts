import { Knex } from 'knex';
export declare type Count = string | number | undefined;
export declare const countToNumber: (count: string | number | undefined) => number;
export declare const countMoreThanZero: (count: Count) => boolean;
export declare const selectQuery: <Q extends Knex.QueryBuilder<any, any>>(q: Q) => Q;
export declare const mapCount: (result: Array<{
    count?: Count;
}>) => Count;
export declare const mapCountToNumber: (result: {
    count?: Count;
}[]) => number;
