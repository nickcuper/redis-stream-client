import { createClient } from 'redis';
import { RdsOption, RedisClient } from '../types';

export class Redis {
    private readonly client: RedisClient;

    constructor(options: RdsOption) {
        this.client = createClient({
            socket: {
                port: options.port || 6357,
                host: options.host,
                connectTimeout: options.connectTimeout || 0,
                reconnectStrategy: options.reconnectStrategy || undefined,
            },
            password: options.password,
            database: options.database || 0,
        });
    }

    create(): RedisClient {
        return this.client.duplicate();
    }
}
