export class StreamListenerError extends Error {
    constructor(stack: string) {
        super('Stream listener');
        this.stack = stack;
    }
}
