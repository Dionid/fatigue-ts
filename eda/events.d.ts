import { Maybe } from 'functional-oriented-programming-ts';
export declare type FullEventMeta = {
    userId: Maybe<string>;
    id: string;
    rootTransactionId: string;
    createdAt: Date;
};
export declare type FullEvent<E extends Event<any, any, any> = Event<any, any, any>> = E & {
    meta: FullEventMeta;
};
export declare const FullEvent: {
    fromEvent: <E extends Event<any, any, any>>(props: {
        event: E;
        id?: string | undefined;
        createdAt?: Date | undefined;
        userId: Maybe<string>;
        rootTransactionId?: string | undefined;
    }) => FullEvent<E>;
    fromParentEvent: <E_1 extends Event<any, any, any>>(props: {
        event: E_1;
        parentEvent: FullEvent;
        id?: string | undefined;
        createdAt?: Date | undefined;
    }) => FullEvent<E_1>;
    fromCmdOrQuery: <E_2 extends Event<any, any, any>>(props: {
        event: E_2;
        meta: {
            userId: Maybe<string>;
            transactionId: string;
        };
        id?: string | undefined;
        createdAt?: Date | undefined;
    }) => FullEvent<E_2>;
    mapEventsFromCmdOrQuery: (meta: {
        userId: Maybe<string>;
        transactionId: string;
    }) => (events: Array<Event<any, any, any>>) => FullEvent<Event<any, any, any>>[];
};
export declare type Event<Type, Version extends string, Data extends Record<any, any>> = {
    type: Type;
    data: Data;
    version: Version;
};
export declare type EventFactory<E extends Event<any, any, any>> = {
    new: (data: E['data']) => E;
    type: E['type'];
    version: E['version'];
    is: (e: Event<any, any, any>) => e is E;
    isFull: (e: FullEvent) => e is FullEvent<E>;
};
export declare const newEventFactory: <E extends Event<any, any, any>>(type: E["type"], version: E["version"]) => EventFactory<E>;
export declare const EventFactory: {
    new: <E extends Event<any, any, any>>(type: E["type"], version: E["version"]) => EventFactory<E>;
};
export declare type EventHandler<E extends FullEvent<any>> = (event: E) => Promise<void>;
