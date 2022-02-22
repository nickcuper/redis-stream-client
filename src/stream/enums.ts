export enum ReaderEvent {
    Data = 'x-read-data',
    WaitForData = 'x-wait-for-data',
}

export enum RedisEvents {
    End = 'end',
    Error = 'error',
    Ready = 'ready',
    Connect = 'connect',
    Reconnecting = 'reconnecting',
}
