import { StreamListenerError } from '../errors';
import { StreamListener, StreamReader } from '../stream';
import { Redis } from './redis';
import { RdsOption, StreamKey } from '../types';

export class RdsClient {
    private readonly redisClient: Redis;

    constructor(config: RdsOption) {
        this.redisClient = new Redis(config);
    }

    async createListener(streamName: StreamKey): Promise<StreamListener | never> {
        try {
            const streamReader = new StreamReader(this.redisClient.create(), streamName);
            await streamReader.connect();
            return new StreamListener(streamReader);
        } catch (error) {
            //@ts-ignore
            throw new StreamListenerError(error.message);
        }
    }
}
