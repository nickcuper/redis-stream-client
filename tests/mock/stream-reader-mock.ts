import { EventEmitter } from 'events';
import { EventPayload } from '../../src';

export class StreamReaderMock extends EventEmitter {
    constructor() {
        super();
    }

    onData(fn: (data: EventPayload) => void): void {
        this.on('data', fn);
    }

    emitToDataChannel(data: EventPayload): void {
        this.emit('data', data);
    }

    destroy(): void {
        this.removeAllListeners('data');
    }
}
