import { createClient } from 'redis';
import { Redis } from '../src/client/redis';

describe('Redis', () => {
    it('create client with param', () => {
        const redis = new Redis({
            port: 6357,
            password: '123',
            host: 'localhost',
            connectTimeout: 3000,
            database: 10,
            reconnectStrategy: (retry) => Math.min(retry * 500, 3000),
        });
        redis.create();

        expect(createClient).toHaveBeenCalledWith({
            socket: {
                port: 6357,
                host: 'localhost',
                connectTimeout: 3000,
                reconnectStrategy: expect.any(Function),
            },
            password: '123',
            database: 10,
        });
    });

    it('create client with default params', () => {
        const redis = new Redis({ password: '123', host: 'localhost' });
        redis.create();

        expect(createClient).toHaveBeenCalledWith({
            socket: {
                port: 6357,
                host: 'localhost',
                connectTimeout: 0,
                reconnectStrategy: undefined,
            },
            password: '123',
            database: 0,
        });
    });
});
