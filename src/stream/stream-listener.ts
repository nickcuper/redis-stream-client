import { nanoid } from 'nanoid';
import { EventFilterManager } from '../utils/event-filter-manager';
import { BroadcastManager } from '../utils/broadcast-manager';
import { StreamReader } from './stream-reader';
import { RdsEventFilter, Emitter, Subscriptions } from '../types';

export class StreamListener {
    get name(): string {
        return this.streamReader.streamName;
    }

    private readonly subscribers = new Map<string, BroadcastManager>();

    constructor(private readonly streamReader: StreamReader) {
        this.streamReader.onData((payload) => {
            this.subscribers.forEach((subscriber) => subscriber.dispatch(payload));
        });
    }

    subscribe(filters: RdsEventFilter[], emitter: Emitter): Subscriptions {
        const uuid = nanoid();
        const broadcaster = new BroadcastManager(new EventFilterManager([...filters]), emitter);
        this.subscribers.set(uuid, broadcaster);

        return {
            unsubscribe: () => this.subscribers.delete(uuid),
        };
    }

    async dispose(): Promise<void> {
        this.subscribers.clear();
        await this.streamReader.destroy();
    }
}
