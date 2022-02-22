import { EventFilterManager } from './event-filter-manager';
import { Emitter, EventPayload } from '../types';

export class BroadcastManager {
    constructor(private eventFilterManager: EventFilterManager, private emitter: Emitter) {}

    dispatch(payload: EventPayload): void {
        if (this.eventFilterManager.approved(payload?.name)) {
            try {
                this.emitter.dispatch(payload);
            } catch (error) {
                console.error('[RDS][EMITTER:DISPATCH]', { error, payload });
            }
        }
    }
}
