import { FastifyReply } from 'fastify';

import { buildAdminContext, getOsVersion, getIpV4Address, FastifyRequestExtension } from '../../src/lib/build-context';

describe('build-context', () => {
  test('buildAdminContext', async () => {
    const buildFn = buildAdminContext();

    const request = {
      headers: {
        cookie: '0',
        'x-forwarded-for': 'localhost',
      },
    } as FastifyRequestExtension;

    const context = await buildFn(request, {} as FastifyReply);

    expect(context.requestId).toBeTruthy();
    expect(context.client).toEqual({
      platform: 'WEB',
      category: 'ADMIN',
      ipAddress: 'localhost',
      osVersion: 'test',
      language: 'EN',
    });
    expect(context.requestSender).toBe('CONTROL_CENTER');
  });

  test('getOsVersion', async () => {
    const ua =
      'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36';

    expect(getOsVersion(ua)).toBe('Chrome-51.0.2704.64');
    expect(getOsVersion('foobar')).toBe('test');
    expect(() => getOsVersion(undefined, 'production')).toThrow('user-agent must be provided');
  });

  test('getIpV4Address', async () => {
    expect(
      getIpV4Address({
        headers: {
          cookie: '0',
          'x-forwarded-for': '::ffff:localhost',
        },
      } as unknown as FastifyRequestExtension)
    ).toBe('localhost');

    expect(
      getIpV4Address({
        headers: {
          cookie: '0',
          'x-forwarded-for': '::1',
        },
      } as unknown as FastifyRequestExtension)
    ).toBe('localhost');
  });
});
