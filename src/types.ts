import { createClient } from 'redis';

export type RedisClient = typeof createClient extends () => infer ResultType ? ResultType : never;

export type StreamKey = string;

export type EventPayload<EventData = any> = {
    name: string;
    gameId: string;
    time: string;
    eventData: EventData;
};

export type RdsOption = {
    port?: number;
    host: string;
    database?: number;
    password: string;
    connectTimeout?: number;
    reconnectStrategy?: (retry: number) => number | undefined;
};

export interface RdsEventFilter {
    readonly name: string;
    isMatched(eventName: string): boolean;
}

export interface Subscriptions {
    unsubscribe(): void;
}

export interface Emitter {
    dispatch(payload: EventPayload): void;
}

export interface StreamListener {
    readonly name: string;
    subscribe(filters: RdsEventFilter[], emitter: Emitter): Subscriptions;
    dispose(): Promise<void>;
}
