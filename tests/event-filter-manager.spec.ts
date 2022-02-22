import { EventFilterManager } from '../src/utils/event-filter-manager';
import { EventFilter } from '../src';

describe('EventFilterManager', () => {
    it('return true for one filter who matched with param', () => {
        const expectEventName = 'btc-eth:v1';
        const filter = new EventFilter(expectEventName);
        const spyOnFilter = jest.spyOn(filter, 'isMatched');
        const filterManager = new EventFilterManager([filter]);
        const expectApprove = filterManager.approved(expectEventName);

        expect(spyOnFilter).toHaveBeenCalledWith(expectEventName);
        expect(expectApprove).toBeTruthy();
    });

    it('return false if param is not a string or empty string', () => {
        const filterManager = new EventFilterManager([new EventFilter('btc-eth:v1')]);

        expect(filterManager.approved('')).toBeFalsy();
        expect(filterManager.approved(null)).toBeFalsy();
        expect(filterManager.approved(undefined)).toBeFalsy();
    });

    it('return false if CustomFilter is used without param', () => {
        const filterManager = new EventFilterManager([
            new EventFilter(''),
            new EventFilter(null),
            new EventFilter(undefined),
        ]);

        expect(filterManager.approved('')).toBeFalsy();
        expect(filterManager.approved(null)).toBeFalsy();
        expect(filterManager.approved(undefined)).toBeFalsy();
    });

    it('return false if no filter has been assign', () => {
        const expectEventName = 'run-stop';
        const filterManager = new EventFilterManager([]);

        expect(filterManager.approved(expectEventName)).toBeFalsy();
    });

    it('use 2 filters one of them will not match with event name', () => {
        const gameStateFilter = new EventFilter('btc-eth:v1');
        const spyOnGameStateFilter = jest.spyOn(gameStateFilter, 'isMatched');
        const roundClosedFilter = new EventFilter('round-closed:v1');
        const spyOnRoundClosedFilter = jest.spyOn(roundClosedFilter, 'isMatched');
        const expectEventName = 'round-closed:v1';
        const filterManager = new EventFilterManager([gameStateFilter, roundClosedFilter]);
        const expectApprove = filterManager.approved(expectEventName);

        expect(spyOnGameStateFilter).toHaveBeenCalledWith(expectEventName);
        expect(spyOnRoundClosedFilter).toHaveBeenCalledWith(expectEventName);
        expect(expectApprove).toBeTruthy();
    });
});
