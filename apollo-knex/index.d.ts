import { Maybe } from 'functional-oriented-programming-ts';
import { Knex } from 'knex';
export declare const limitArgToQuery: (args: {
    limit?: Maybe<number>;
}) => <Q extends Knex.QueryBuilder<any, any>>(query: Q) => Q;
export declare const offsetArgToQuery: (args: {
    offset?: Maybe<number>;
}) => <Q extends Knex.QueryBuilder<any, any>>(query: Q) => Q;
export declare const orderByArgToQuery: (args: {
    orderBy?: Maybe<Record<string, Maybe<string>>>;
}) => <Q extends Knex.QueryBuilder<any, any>>(query: Q) => Q;
export declare const mapCommonSearchParamsToQuery: (args: {
    orderBy?: Maybe<Record<string, Maybe<string>>>;
    offset?: Maybe<number>;
    limit?: Maybe<number>;
}) => <Q extends Knex.QueryBuilder<any, any>>(query: Q) => Q;
