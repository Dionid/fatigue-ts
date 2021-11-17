import { Event, EventBus, EventBusService, EventHandler, FullEvent } from '../eda';
export declare type EventBusInMemoryPersistor = {
    saveEvent: <E extends FullEvent>(event: E) => Promise<E>;
};
export declare type EventBusInMemory = EventBus & {
    tx: boolean;
    storedEvents: FullEvent[];
    eventHandlers: Record<string, Array<EventHandler<any>>>;
    onError: (e: any) => void;
    persistor?: EventBusInMemoryPersistor;
    log?: (...args: any) => void;
};
export declare const create: (props?: {
    tx?: boolean | undefined;
    storedEvents?: FullEvent<Event<any, any, any>>[] | undefined;
    eventHandlers?: Record<string, EventHandler<any>[]> | undefined;
    persistor?: EventBusInMemoryPersistor | undefined;
    onError?: ((e: any) => void) | undefined;
    log?: ((...args: any) => void) | undefined;
}) => EventBusInMemory;
export declare const unsubscribe: <E extends Event<any, any, any>>(ebps: EventBusInMemory, eventName: E["type"], eventHandler: EventHandler<FullEvent<E>>) => Promise<EventBusInMemory>;
export declare const unsubscribeC: <E extends Event<any, any, any>>(eventName: E["type"], eventHandler: EventHandler<FullEvent<E>>) => (ebps: EventBusInMemory) => Promise<EventBusInMemory>;
export declare const subscribe: <E extends Event<any, any, any>>(ebps: EventBusInMemory, eventName: E["type"], eventHandler: EventHandler<FullEvent<E>>) => Promise<EventBusInMemory>;
export declare const subscribeC: <E extends Event<any, any, any>>(eventName: E["type"], eventHandler: EventHandler<FullEvent<E>>) => (ebps: EventBusInMemory) => Promise<EventBusInMemory>;
export declare const publish: (ebps: EventBusInMemory, events: readonly FullEvent[]) => Promise<void>;
export declare const publishC: (events: readonly FullEvent[]) => (ebps: EventBusInMemory) => Promise<void>;
export declare const tx: (ebps: EventBusInMemory) => Promise<EventBusInMemory>;
export declare const commit: (ebps: EventBusInMemory) => Promise<EventBusInMemory>;
export declare const rollback: (ebps: EventBusInMemory) => Promise<EventBusInMemory>;
export declare const pull: <E extends Event<any, any, any>>(ebps: EventBusInMemory, eventName: E["type"]) => Promise<E>;
export declare const pullC: <E extends Event<any, any, any>>(eventName: E["type"]) => (ebps: EventBusInMemory) => Promise<E>;
export declare function observe<E extends Event<any, any, any>>(ebps: EventBusInMemory, eventName: E['type']): AsyncGenerator<{
    stop: () => void;
    data: E;
}, void, unknown>;
export declare const observeC: <E extends Event<any, any, any>>(eventName: E["type"]) => (ebps: EventBusInMemory) => AsyncGenerator<{
    stop: () => void;
    data: E;
}, void, unknown>;
export declare type EventBusInMemoryBehaviour = typeof EventBusInMemory;
export declare const EventBusInMemory: {
    create: (props?: {
        tx?: boolean | undefined;
        storedEvents?: FullEvent<Event<any, any, any>>[] | undefined;
        eventHandlers?: Record<string, EventHandler<any>[]> | undefined;
        persistor?: EventBusInMemoryPersistor | undefined;
        onError?: ((e: any) => void) | undefined;
        log?: ((...args: any) => void) | undefined;
    }) => EventBusInMemory;
    unsubscribe: <E extends Event<any, any, any>>(ebps: EventBusInMemory, eventName: E["type"], eventHandler: EventHandler<FullEvent<E>>) => Promise<EventBusInMemory>;
    unsubscribeC: <E_1 extends Event<any, any, any>>(eventName: E_1["type"], eventHandler: EventHandler<FullEvent<E_1>>) => (ebps: EventBusInMemory) => Promise<EventBusInMemory>;
    subscribe: <E_2 extends Event<any, any, any>>(ebps: EventBusInMemory, eventName: E_2["type"], eventHandler: EventHandler<FullEvent<E_2>>) => Promise<EventBusInMemory>;
    subscribeC: <E_3 extends Event<any, any, any>>(eventName: E_3["type"], eventHandler: EventHandler<FullEvent<E_3>>) => (ebps: EventBusInMemory) => Promise<EventBusInMemory>;
    publish: (ebps: EventBusInMemory, events: readonly FullEvent[]) => Promise<void>;
    publishC: (events: readonly FullEvent[]) => (ebps: EventBusInMemory) => Promise<void>;
    pull: <E_4 extends Event<any, any, any>>(ebps: EventBusInMemory, eventName: E_4["type"]) => Promise<E_4>;
    pullC: <E_5 extends Event<any, any, any>>(eventName: E_5["type"]) => (ebps: EventBusInMemory) => Promise<E_5>;
    observe: typeof observe;
    observeC: <E_6 extends Event<any, any, any>>(eventName: E_6["type"]) => (ebps: EventBusInMemory) => AsyncGenerator<{
        stop: () => void;
        data: E_6;
    }, void, unknown>;
    tx: (ebps: EventBusInMemory) => Promise<EventBusInMemory>;
    commit: (ebps: EventBusInMemory) => Promise<EventBusInMemory>;
    rollback: (ebps: EventBusInMemory) => Promise<EventBusInMemory>;
};
export declare type EventBusInMemoryService = EventBusService;
export declare const EventBusInMemoryService: {
    fromEventBusInmemory: (ebps: EventBusInMemory) => EventBusService;
    create: (props: {
        tx?: boolean | undefined;
        storedEvents?: FullEvent<Event<any, any, any>>[] | undefined;
        eventHandlers?: Record<string, EventHandler<any>[]> | undefined;
        persistor?: EventBusInMemoryPersistor | undefined;
        onError?: ((e: any) => void) | undefined;
        log?: ((...args: any) => void) | undefined;
    }) => EventBusService;
};
