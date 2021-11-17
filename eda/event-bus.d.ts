import { Event, EventHandler, FullEvent } from './events';
export declare type EventBus = {
    readonly EBD: unique symbol;
};
export declare type unsubscribe<EBD extends EventBus = EventBus> = <E extends Event<any, any, any>>(ebd: EBD, eventName: E['type'], eventHandler: EventHandler<FullEvent<E>>) => Promise<EBD>;
export declare type unsubscribeC<EBD extends EventBus = EventBus> = <E extends Event<any, any, any>>(eventName: E['type'], eventHandler: EventHandler<FullEvent<E>>) => (ebd: EBD) => Promise<EBD>;
export declare type subscribe<EBD extends EventBus = EventBus> = <E extends Event<any, any, any>>(ebd: EBD, eventName: E['type'], eventHandler: EventHandler<FullEvent<E>>) => Promise<EBD>;
export declare type subscribeC<EBD extends EventBus = EventBus> = <E extends Event<any, any, any>>(eventName: E['type'], eventHandler: EventHandler<FullEvent<E>>) => (ebd: EBD) => Promise<EBD>;
export declare type publish<EBD extends EventBus = EventBus> = (ebd: EBD, events: readonly FullEvent[]) => Promise<void>;
export declare type publishC<EBD extends EventBus = EventBus> = (events: readonly FullEvent[]) => (ebd: EBD) => Promise<void>;
export declare type pull<EBD extends EventBus = EventBus> = <E extends Event<any, any, any>>(ebd: EBD, eventName: E['type']) => Promise<E>;
export declare type pullC<EBD extends EventBus = EventBus> = <E extends Event<any, any, any>>(eventName: E['type']) => (ebd: EBD) => Promise<E>;
export declare type observe<EBD extends EventBus = EventBus> = <E extends Event<any, any, any>>(ebd: EBD, eventName: E['type']) => AsyncGenerator<{
    stop: () => void;
    data: E;
}, void, unknown>;
export declare type observeC<EBD extends EventBus = EventBus> = <E extends Event<any, any, any>>(eventName: E['type']) => (ebd: EBD) => AsyncGenerator<{
    stop: () => void;
    data: E;
}, void, unknown>;
export declare type tx<EBD extends EventBus = EventBus> = (ebd: EBD) => Promise<EBD>;
export declare type commit<EBD extends EventBus = EventBus> = (ebd: EBD) => Promise<EBD>;
export declare type rollback<EBD extends EventBus = EventBus> = (ebd: EBD) => Promise<EBD>;
export declare type EventBusBehaviour<EBD extends EventBus = EventBus> = {
    unsubscribe: unsubscribe<EBD>;
    unsubscribeC: unsubscribeC<EBD>;
    subscribe: subscribe<EBD>;
    subscribeC: subscribeC<EBD>;
    publish: publish<EBD>;
    publishC: publishC<EBD>;
    pull: pull<EBD>;
    pullC: pullC<EBD>;
    observe: observe<EBD>;
    observeC: observeC<EBD>;
    tx: tx<EBD>;
    commit: commit<EBD>;
    rollback: rollback<EBD>;
};
export declare type EventBusService = {
    unsubscribe<E extends Event<any, any, any>>(eventName: E['type'], eventHandler: EventHandler<FullEvent<E>>): Promise<EventBusService>;
    subscribe<E extends Event<any, any, any>>(eventName: E['type'], eventHandler: EventHandler<FullEvent<E>>): Promise<EventBusService>;
    publish(events: readonly FullEvent[]): Promise<void>;
    pull<E extends Event<any, any, any>>(eventName: E['type']): Promise<E>;
    observe<E extends Event<any, any, any>>(eventName: E['type']): AsyncGenerator<{
        stop: () => void;
        data: E;
    }, void, unknown>;
    tx(): Promise<EventBusService>;
    commit(): Promise<EventBusService>;
    rollback(): Promise<EventBusService>;
};
