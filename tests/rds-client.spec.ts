import { RdsClient, RdsOption } from '../src';
import { StreamListener } from '../src/stream';

describe('RdsClient', () => {
    it('createListener', async () => {
        const expectedConfig = {} as RdsOption;
        const expectChannel = 'btc:1';

        const rds = new RdsClient(expectedConfig);
        const listener = await rds.createListener(expectChannel);

        expect(listener).toBeInstanceOf(StreamListener);
    });
});
