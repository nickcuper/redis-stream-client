import { EventEmitter } from 'events';
import { ReaderEvent, RedisEvents } from './enums';
import { RedisClient, StreamKey, EventPayload } from '../types';

export class StreamReader extends EventEmitter {
    get streamName(): string {
        return this.stream;
    }

    constructor(private readonly redisClient: RedisClient, private readonly stream: StreamKey) {
        super();
    }

    async connect(): Promise<void> {
        this.on(ReaderEvent.WaitForData, this.consume.bind(this));
        this.redisClient.on(RedisEvents.Ready, () => this.emit(ReaderEvent.WaitForData));
        this.redisClient.on(RedisEvents.End, () =>
            this.off(ReaderEvent.WaitForData, this.consume.bind(this)),
        );
        this.redisClient.on(RedisEvents.Error, (error: Error) => {
            this.off(ReaderEvent.WaitForData, this.consume.bind(this));
            console.error('[RDS-CLIENT][%s]', this.stream, error);
        });

        await this.redisClient.connect();
    }

    onData(fn: (payload: EventPayload) => void): void {
        this.on(ReaderEvent.Data, fn);
    }

    async destroy(): Promise<void> {
        this.removeAllListeners();
        await this.redisClient.quit();
    }

    private async consume(id = '$'): Promise<void> {
        try {
            const [
                {
                    messages: [{ message, id: index }],
                },
            ] = await this.redisClient.xRead([{ key: this.stream, id }], { BLOCK: 0, COUNT: 1 });

            try {
                message.eventData = JSON.parse(message.eventData);
            } catch (error) {}

            this.emit(ReaderEvent.Data, message);
            this.emit(ReaderEvent.WaitForData, index);
        } catch (error) {
            console.error('[RDS][STREAM-READER][CONSUME]', error);
        }
    }
}
