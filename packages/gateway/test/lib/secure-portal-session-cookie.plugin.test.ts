import config from 'config-dug';
import { GraphQLRequestContextWillSendResponse } from '@apollo/server';

import { ClientCategory, CustomerContext, RequestSender } from '@neofinancial/neo-framework';

import {
  getSecureSessionCookieWillSendResponse,
  secureSessionCookiePlugin as plugin,
} from '../../src/lib/secure-portal-session-cookie.plugin';

describe('session cookie plugins', () => {
  test('requestDidStart', async () => {
    await expect(plugin('test-cookie').requestDidStart?.({} as never)).resolves.toHaveProperty('willSendResponse');
  });

  describe('willSendResponse', () => {
    const mockContext = (origin?: string) => {
      const headers: { [key: string]: unknown } = {};

      const context = {
        request: {
          http: {
            headers: {
              get: (): string => {
                return origin || (config.SECURE_PORTAL_DOMAIN as string);
              },
            },
          },
        },
        response: {
          http: {
            headers: {
              set: (k: string, v: unknown): void => {
                headers[k] = v;
              },
            },
          },
        },
        contextValue: {
          requestId: '1234567890',
          requestSender: RequestSender.CUSTOMER,
          sessionData: {
            token: '0',
            tokenExpiresAt: new Date(),
          },
          client: {
            category: ClientCategory.CUSTOMER,
          },
        },
      } as unknown as GraphQLRequestContextWillSendResponse<CustomerContext>;

      return {
        context,
        headers,
      };
    };

    test('should set the cookie when origin is secure-portal', async () => {
      const { context, headers } = mockContext();

      const willSendResponse = getSecureSessionCookieWillSendResponse('test-cookie');

      await willSendResponse(context);

      expect(headers).toHaveProperty('Set-Cookie');
      expect(headers['Set-Cookie']).toMatch(/^test-cookie=0.*/);
    });

    test('should set the cookie when origin is the one defined on ADMIN_SESSION_COOKIE_DOMAIN', async () => {
      const { context, headers } = mockContext(config.ADMIN_SESSION_COOKIE_DOMAIN as string);

      const willSendResponse = getSecureSessionCookieWillSendResponse('test-cookie');

      await willSendResponse(context);

      expect(headers).toHaveProperty('Set-Cookie');
      expect(headers['Set-Cookie']).toMatch(/^test-cookie=0.*/);
    });

    test('should not set the cookie when origin is not secure-portal', async () => {
      const { context, headers } = mockContext('non-secure-portal-origin');

      const willSendResponse = getSecureSessionCookieWillSendResponse('test-cookie');

      await willSendResponse(context);

      expect(headers).not.toHaveProperty('Set-Cookie');
    });
  });
});
