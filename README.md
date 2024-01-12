# Redis stream client

Allow consuming data from redis stream

### Quick start

in your package.json
```json
{
  "dependencies": {
    "rds-client": "git@github.com:nickcuper/redis-stream-client.git"
  }
}
```
**Usage**:  

```typescript
import {
    EventFilter,
    StreamListener,
    RdsClient,
    EventPayload
} from 'rds-client';
import { Socket } from 'socket.io';

// Initialize rds service
const rdsClient = new RdsClient({ 
    port: 6357, // default value 6357
    host: 'rds.host.local',
    password: 'rds.password.here',
    connectTimeout: 5000, // default value 0,
    database: 10, // default value 0,
    reconnectStrategy: (retry: number) => Math.min(retry * 500, 3000),
});

// Create new connection to stream
const btcListerner = await rdsClient.createListener('btc');

class RateUpdateSocketEmitter implements Emitter {
    constructor(private readonly socket: Socket) {}

    dispatch(payload): void {
        this.socket.emit('btc-rate', payload);
    }
}

const socketClient = new Socket('ws://localhost:3001');
const btcRateUpdateEmitter = new RateUpdateSocketEmitter(socketClient);

// Broadcaster
// btcUsdSubscription provides only data from btc-usd:v1 event 
// and emmit data to socket channel 
const btcUsdSubscription = btcListerner.subscriber([new EventFilter('btc-usd:v1')], btcRateUpdateEmitter);

// Lest expose data from btc-usd:v1 and btc-usdt:v1 events to custom emmiter
import { EventEmitter } from 'events';
const customEmitter = new EventEmitter();

class RateEmitter implements Emitter {
    constructor(private readonly emitter: EventEmitter) {}

    dispatch(payload: EventPayload): void {
        this.emitter.emit('rate', payload);
    }
}

const rateSubscription = btcListerner.subscriber(
  [new EventFilter('btc-usd:v1'), new EventFilter('btc-usdt:v1')],
  new RateEmitter(customEmitter),
);

// To remove particular subscriber use unsubscribe
// After that you imidiatly stop to recived data from btc-usd:v1 and btc-usdt:v1 events
rateSubscription.unsubscribe();

// To close `btc` connection and remove all broadcasters
async () => {
    await rateSubscription.dispose();
}
// Or use promise
rateSubscription.dispose().then(() => {
    // ... do what ever you want
});
```

**Event filters**:

Usage:
```typescript
import { EventFilter } from 'rds-client';

streamListerner.subscriber([new CustomFilter('custom-event-name:v1')], emitter);
```

If you need to change how name will be checking simply override isMatched function
Example:

```typescript
export { EventFilter } from 'rds-client';

// will sniffer all events which include "usdt" in name
class UsdtFilter extends EventFilter {
    constructor() {
        super('');
    }

     isMatched(eventName: string): boolean {
         return eventName.includes('usdt');
     }
}

listerner.subscriber([new UsdtFilter()], emitter);
```
