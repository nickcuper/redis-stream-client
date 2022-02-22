import { BroadcastManager } from '../src/utils/broadcast-manager';
import { EventFilter, EventPayload } from '../src';
import { EventFilterManager } from '../src/utils/event-filter-manager';
import { EmitterMock } from './mock/emitter-mock';

describe('BroadcastManager', () => {
    it('will approved and dispatched by RoundClosedFilter', () => {
        const emitter = new EmitterMock();
        const filters = [new EventFilter('btc-eth:v1'), new EventFilter('btc-usdt:v1')];
        const filterManager = new EventFilterManager(filters);
        const spyOnApproved = jest.spyOn(filterManager, 'approved');

        const spyOnDispatch = jest.spyOn(emitter, 'dispatch');
        const expectPayload = { name: 'btc-usdt:v1' } as EventPayload;
        const broadcastManager = new BroadcastManager(filterManager, emitter);
        broadcastManager.dispatch(expectPayload);

        expect(spyOnApproved).toHaveBeenCalledWith(expectPayload.name);
        expect(spyOnDispatch).toHaveBeenCalledWith(expectPayload);
    });

    it('will approved and dispatched once for duplicate filters', () => {
        const emitter = new EmitterMock();
        const eventName = 'custom-event';
        const filters = [new EventFilter(eventName), new EventFilter(eventName)];
        const filterManager = new EventFilterManager(filters);
        const spyOnApproved = jest.spyOn(filterManager, 'approved');

        const spyOnDispatch = jest.spyOn(emitter, 'dispatch');
        const expectPayload = { name: eventName } as EventPayload;
        const broadcastManager = new BroadcastManager(filterManager, emitter);
        broadcastManager.dispatch(expectPayload);

        expect(spyOnApproved).toHaveBeenCalledWith(expectPayload.name);
        expect(spyOnDispatch).toHaveBeenCalledWith(expectPayload);
        expect(spyOnDispatch).toHaveBeenCalledTimes(1);
    });

    it('will not dispatch', () => {
        const filterManager = new EventFilterManager([
            new EventFilter('btc-eth:v1'),
            new EventFilter('btc-usdt:v1'),
        ]);
        const spyOnApproved = jest.spyOn(filterManager, 'approved');
        const emitter = new EmitterMock();
        const spyOnDispatch = jest.spyOn(emitter, 'dispatch');
        const expectPayload = { name: 'update' } as EventPayload;
        const broadcastManager = new BroadcastManager(filterManager, emitter);
        broadcastManager.dispatch(expectPayload);

        expect(spyOnApproved).toHaveBeenCalledWith(expectPayload.name);
        expect(spyOnDispatch).not.toHaveBeenCalled();
    });

    it('will not approved for undefined eventName', () => {
        const filterManager = new EventFilterManager([
            new EventFilter('btc-eth:v1'),
            new EventFilter('btc-usdt:v1'),
        ]);
        const spyOnApproved = jest.spyOn(filterManager, 'approved');
        const emitter = new EmitterMock();
        const spyOnDispatch = jest.spyOn(emitter, 'dispatch');
        const expectPayload = {} as EventPayload;
        const broadcastManager = new BroadcastManager(filterManager, emitter);
        broadcastManager.dispatch(expectPayload);

        expect(spyOnApproved).toHaveBeenCalledWith(undefined);
        expect(spyOnDispatch).not.toHaveBeenCalled();
    });

    it('will not approved for null eventName', () => {
        const filterManager = new EventFilterManager([
            new EventFilter('btc-eth:v1'),
            new EventFilter('btc-usdt:v1'),
        ]);
        const spyOnApproved = jest.spyOn(filterManager, 'approved');
        const emitter = new EmitterMock();
        const spyOnDispatch = jest.spyOn(emitter, 'dispatch');
        const expectPayload = { name: null } as EventPayload;
        const broadcastManager = new BroadcastManager(filterManager, emitter);
        broadcastManager.dispatch(expectPayload);

        expect(spyOnApproved).toHaveBeenCalledWith(null);
        expect(spyOnDispatch).not.toHaveBeenCalled();
    });

    it('will not approved for empty eventName', () => {
        const filterManager = new EventFilterManager([
            new EventFilter('btc-eth:v1'),
            new EventFilter('btc-usdt:v1'),
        ]);
        const spyOnApproved = jest.spyOn(filterManager, 'approved');
        const emitter = new EmitterMock();
        const spyOnDispatch = jest.spyOn(emitter, 'dispatch');
        const expectPayload = { name: '' } as EventPayload;
        const broadcastManager = new BroadcastManager(filterManager, emitter);
        broadcastManager.dispatch(expectPayload);

        expect(spyOnApproved).toHaveBeenCalledWith('');
        expect(spyOnDispatch).not.toHaveBeenCalled();
    });
});
