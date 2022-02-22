import { RdsEventFilter } from '../types';

export class EventFilterManager {
    constructor(private readonly filters: RdsEventFilter[] = []) {}

    approved(eventName: string): boolean {
        return this.filters.some((filter: RdsEventFilter) => filter.isMatched(eventName));
    }
}
