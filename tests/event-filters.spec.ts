import { EventFilter } from '../src';

describe('EventFilters', () => {
    it('filter name is sanitized', () => {
        const filter = new EventFilter(' event- name :v1');
        expect(filter.name).toEqual('event-name:v1');
    });

    it('filter name is equal to constructor param', () => {
        const filter = new EventFilter(null);
        expect(filter.name).toEqual(null);
    });

    it('return false for string as param', () => {
        const filter = new EventFilter('');
        expect(filter.isMatched('event')).toBeFalsy();
    });

    it('return false for null as param', () => {
        const filter = new EventFilter('');
        expect(filter.isMatched(null)).toBeFalsy();
    });

    it('return false for undefined as param', () => {
        const filter = new EventFilter('');
        expect(filter.isMatched(undefined)).toBeFalsy();
    });

    it('filter name is equal to constructor param', () => {
        const eventName = 'custom-event-name';
        const filter = new EventFilter(eventName);
        expect(filter.name).toEqual(eventName);
    });
});
