import { reveal, stub } from 'jest-auto-stub';
import { AxiosStatic } from 'axios';

import { Sentry } from '@neofinancial/neo-monitoring';

import { statusCheck, getServices, buildService } from '../../src/lib/service-list';

beforeAll(async (): Promise<void> => {
  jest.spyOn(Sentry, 'captureMediumPriority').mockImplementationOnce(() => undefined);
});

beforeEach(async (): Promise<void> => {
  jest.clearAllMocks();
});

describe('service list', () => {
  test('statusCheck pass', async () => {
    const axiosMock = stub<AxiosStatic>();

    await expect(statusCheck({ name: '', url: '' })).resolves.toBeUndefined();

    reveal(axiosMock).get.mockResolvedValue('test');

    await expect(statusCheck({ name: '', url: 'true' }, axiosMock)).resolves.toEqual({ name: '', url: 'true' });
  });

  test('statusCheck fail', async () => {
    const axiosMock = stub<AxiosStatic>();

    reveal(axiosMock).get.mockRejectedValue(new Error());

    await expect(statusCheck({ name: '', url: 'true' }, axiosMock)).resolves.toBeUndefined();
  });

  test('getServices', async () => {
    expect((await getServices([])).runningServices).toEqual([]);
    expect((await getServices([{ name: '', url: 'true' }])).runningServices).toEqual([]);
    expect((await getServices([])).offlineServices).toEqual([]);
    expect((await getServices([{ name: '', url: 'true' }])).offlineServices).toEqual([{ name: '', url: 'true' }]);
  });

  test('buildService', async () => {
    const service = buildService()({ name: 'test', url: 'http://test' });

    expect(service).toMatchObject({ apq: false, fetcher: expect.any(Function), name: 'test', url: 'http://test' });
  });

  test('buildService does not Sentry when all services are present in triage map', async () => {
    buildService()({ name: 'test', url: 'https://dispute-service.neo.xyz' });

    expect(Sentry.captureMediumPriority).not.toHaveBeenCalled();
  });
});
