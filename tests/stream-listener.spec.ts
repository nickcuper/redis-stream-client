import { EventFilter, EventPayload, Subscriptions } from '../src';
import { StreamReader, StreamListener } from '../src/stream';
import { EmitterMock } from './mock/emitter-mock';
import { StreamReaderMock } from './mock/stream-reader-mock';

describe('StreamListener', () => {
    describe('create/destroy', () => {
        const streamReaderMock = {
            streamName: 'btc',
            onData: jest.fn(),
            destroy: jest.fn().mockResolvedValue(true),
        } as unknown as StreamReader;

        const streamListener = new StreamListener(streamReaderMock);

        beforeAll(() => {
            expect(streamReaderMock.onData).toHaveBeenCalled();
        });

        it('name is equal to reader stream channel', () => {
            expect(streamListener.name).toBe(streamReaderMock.streamName);
        });

        it('subscribe', () => {
            const spyOnMapSet = jest.spyOn(streamListener['subscribers'], 'set');
            const subscription = streamListener.subscribe(
                [new EventFilter('event-name:v1')],
                new EmitterMock(),
            );

            expect(spyOnMapSet).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
            expect(subscription).toHaveProperty('unsubscribe');
        });

        it('unsubscribe', () => {
            const spyOnMapDelete = jest.spyOn(streamListener['subscribers'], 'delete');
            const subscription = streamListener.subscribe(
                [new EventFilter('event-name:v1')],
                new EmitterMock(),
            );
            subscription.unsubscribe();

            expect(spyOnMapDelete).toHaveBeenCalled();
        });

        it('dispose', async () => {
            const spyOnMapClear = jest.spyOn(streamListener['subscribers'], 'clear');
            await streamListener.dispose();

            expect(spyOnMapClear).toHaveBeenCalled();
            expect(streamReaderMock.destroy).toHaveBeenCalled();
        });
    });

    describe('subscribe/unsubscribe', () => {
        const streamReaderMock = new StreamReaderMock();
        const streamListener = new StreamListener(streamReaderMock as unknown as StreamReader);

        const firstEmitter = new EmitterMock();
        const secondEmitter = new EmitterMock();
        const spyOnFirstEmitter = jest.spyOn(firstEmitter, 'dispatch');
        const spyOnSecondEmitter = jest.spyOn(secondEmitter, 'dispatch');

        const payload = { name: 'run-opened:v1' } as EventPayload;

        let firstSubscription: Subscriptions = undefined;
        let secondSubscription: Subscriptions = undefined;

        beforeEach(() => {
            firstSubscription = streamListener.subscribe(
                [new EventFilter(payload.name)],
                firstEmitter,
            );
            secondSubscription = streamListener.subscribe(
                [new EventFilter(payload.name)],
                secondEmitter,
            );

            expect(firstSubscription).toBeDefined();
            expect(secondSubscription).toBeDefined();
            expect(streamListener['subscribers'].size).toBe(2);
        });

        afterEach(() => {
            spyOnFirstEmitter.mockReset();
            spyOnSecondEmitter.mockReset();

            firstSubscription.unsubscribe();
            secondSubscription.unsubscribe();
            expect(streamListener['subscribers'].size).toBe(0);
        });

        it('data is dispatched to all emitters', () => {
            streamReaderMock.emitToDataChannel(payload);

            expect(streamListener['subscribers'].size).toBe(2);
            expect(spyOnFirstEmitter).toHaveBeenCalled();
            expect(spyOnSecondEmitter).toHaveBeenCalled();
        });

        it('data is dispatched to first emitter only', () => {
            secondSubscription.unsubscribe();

            streamReaderMock.emitToDataChannel(payload);

            expect(streamListener['subscribers'].size).toBe(1);
            expect(spyOnFirstEmitter).toHaveBeenCalled();
            expect(spyOnSecondEmitter).not.toHaveBeenCalled();
        });

        it('data is dispatched to second emitter only', () => {
            firstSubscription.unsubscribe();
            streamReaderMock.emitToDataChannel(payload);

            expect(streamListener['subscribers'].size).toBe(1);
            expect(spyOnSecondEmitter).toHaveBeenCalled();
            expect(spyOnFirstEmitter).not.toHaveBeenCalled();
        });

        it('data is not dispatched to any emitter', () => {
            firstSubscription.unsubscribe();
            secondSubscription.unsubscribe();
            streamReaderMock.emitToDataChannel(payload);

            expect(streamListener['subscribers'].size).toBe(0);
            expect(spyOnFirstEmitter).not.toHaveBeenCalled();
            expect(spyOnSecondEmitter).not.toHaveBeenCalled();
        });
    });
});
