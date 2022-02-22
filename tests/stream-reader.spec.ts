import { StreamReader } from '../src/stream';
import { RedisClient } from '../src/types';

const mockRedisClient = {
    on: jest.fn(),
    connect: jest.fn().mockResolvedValue(void 0),
    xRead: jest.fn().mockResolvedValue(true),
    quit: jest.fn(),
} as unknown as RedisClient;

describe('StreamReader', () => {
    const expectStreamName = 'btc';
    const streamReader = new StreamReader(mockRedisClient, expectStreamName);

    const spyOnOn = jest.spyOn(streamReader, 'on');
    const spyOnRemoveAllListeners = jest.spyOn(streamReader, 'removeAllListeners');

    beforeAll(() => {});

    it('connect', async () => {
        await streamReader.connect();

        expect(spyOnOn).toHaveBeenCalledWith('x-wait-for-data', expect.any(Function));
        expect(mockRedisClient.on).toHaveBeenCalledWith('ready', expect.any(Function));
        expect(mockRedisClient.on).toHaveBeenCalledWith('end', expect.any(Function));
        expect(mockRedisClient.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('onData', () => {
        const expectedCallback = jest.fn();
        streamReader.onData(expectedCallback);

        expect(spyOnOn).toHaveBeenCalledWith('x-read-data', expectedCallback);
    });

    it('destroy', async () => {
        await streamReader.destroy();

        expect(spyOnRemoveAllListeners).toHaveBeenCalled();
        expect(mockRedisClient.quit).toHaveBeenCalled();
    });

    describe('Consume data from redis stream', () => {
        //@todo not the best approach to test this part of code,
        // later on must be replaced by appropriate way
        // without using access to private property via `object['key']`
        const streamData = { name: 'update' };
        const mockRedisClient = {
            on: jest.fn(),
            connect: jest.fn().mockResolvedValue(void 0),
            xRead: jest.fn().mockResolvedValue([{ messages: [{ message: streamData, id: 123 }] }]),
        } as unknown as RedisClient;
        const streamReader = new StreamReader(mockRedisClient, expectStreamName);
        const spyOnEmit = jest.spyOn(streamReader, 'emit');

        it('call consume with default param', async () => {
            await streamReader['consume']();
            expect(mockRedisClient.xRead).toHaveBeenCalledWith(
                [{ id: '$', key: expectStreamName }],
                {
                    BLOCK: 0,
                    COUNT: 1,
                },
            );
            expect(spyOnEmit).toHaveBeenNthCalledWith(1, 'x-read-data', streamData);
            expect(spyOnEmit).toHaveBeenNthCalledWith(2, 'x-wait-for-data', 123);
        });

        it('call consume with specific param', async () => {
            const expectStreamId = '123456789-0';
            await streamReader['consume'](expectStreamId);
            expect(mockRedisClient.xRead).toHaveBeenCalledWith(
                [{ id: expectStreamId, key: expectStreamName }],
                {
                    BLOCK: 0,
                    COUNT: 1,
                },
            );
            expect(spyOnEmit).toHaveBeenNthCalledWith(1, 'x-read-data', streamData);
            expect(spyOnEmit).toHaveBeenNthCalledWith(2, 'x-wait-for-data', 123);
        });
    });
});
