import { Maybe } from 'functional-oriented-programming-ts';
export declare type CommandOrQueryBaseMeta = {
    transactionId: string;
    createdAt: Date;
    userId: Maybe<string>;
    parentTransactionId?: string;
};
export declare type CommandOrQuery<Type extends string, Data extends Record<string, any>> = {
    type: Type;
    data: Data;
    meta: CommandOrQueryBaseMeta;
};
export declare type Query<Type extends string, Data extends Record<string, any>, R> = CommandOrQuery<Type, Data> & {
    _result?: R;
};
export declare const Query: {
    new: <Type extends string, Data extends Record<string, any>, R>(props: {
        type: Type;
        data: Data;
        userId: Maybe<string>;
        transactionId?: string | undefined;
        parentTransactionId?: string | undefined;
        createdAt?: Date | undefined;
    }) => Query<Type, Data, R>;
};
export declare const QueryFactory: <Q extends Query<any, any, any>>(type: Q["type"]) => {
    new: (data: Q["data"], meta: {
        userId: Maybe<string>;
        transactionId?: string;
        parentTransactionId?: string;
        createdAt?: Date;
    }) => Query<Q["type"], Q["data"], Q["_result"]>;
    type: Q["type"];
};
export declare type Command<Type extends string, Data extends Record<string, any>> = Query<Type, Data, undefined>;
export declare const Command: {
    new: <Type extends string, Data extends Record<string, any>>(props: {
        type: Type;
        data: Data;
        userId: Maybe<string>;
        transactionId?: string | undefined;
        parentTransactionId?: string | undefined;
        createdAt?: Date | undefined;
    }) => Command<Type, Data>;
};
export declare const CommandFactory: <Cmd extends Command<any, any>>(type: Cmd["type"]) => {
    new: (data: Cmd["data"], meta: {
        userId: Maybe<string>;
        transactionId?: string;
        parentTransactionId?: string;
        createdAt?: Date;
    }) => Command<Cmd["type"], Cmd["data"]>;
    type: Cmd["type"];
};
export declare type Hybrid<Type extends string, Data extends Record<string, any>, R> = Query<Type, Data, R>;
export declare const Hybrid: {
    new: <H extends Hybrid<any, any, any>>(props: {
        type: H["type"];
        data: H["data"];
        userId: Maybe<string>;
        transactionId?: string | undefined;
        parentTransactionId?: string | undefined;
        createdAt?: Date | undefined;
    }) => Hybrid<H["type"], H["data"], H["_result"]>;
};
export declare const HybridFactory: <H extends Hybrid<any, any, any>>(type: H["type"]) => {
    new: (data: H["data"], meta: {
        userId: Maybe<string>;
        transactionId?: string;
        parentTransactionId?: string;
        createdAt?: Date;
    }) => Hybrid<H["type"], H["data"], H["_result"]>;
    type: H["type"];
};
declare type NonUndefined<T> = Exclude<T, undefined>;
export declare type CommandQueryHandler<CQ extends CommandOrQuery<any, any>, R> = (query: CQ) => Promise<R>;
export declare type QueryHandler<Q extends Query<any, any, any>> = CommandQueryHandler<Q, NonUndefined<Q['_result']>>;
export declare type CommandHandler<Cmd extends Command<any, any>> = CommandQueryHandler<Cmd, void>;
export declare type HybridHandler<HybridCmd extends Hybrid<any, any, any>> = CommandQueryHandler<HybridCmd, NonUndefined<HybridCmd['_result']>>;
export {};
