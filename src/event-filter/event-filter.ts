import { RdsEventFilter } from '../types';

export class EventFilter implements RdsEventFilter {
    get name(): string {
        return this.eventName || null;
    }

    constructor(private readonly eventName: string) {
        this.eventName = (this.eventName || '').replace(/^\|+|\|+| |$/g, '');
    }

    isMatched(eventName: string): boolean {
        return (eventName || '') === this.name;
    }
}
