import config from 'config-dug';
import { addHours } from 'date-fns';
import { GraphQLError } from 'graphql';
import { reveal, stub } from 'jest-auto-stub';

import { AdminSession, AuthorizationRole, Language, RequestSender } from '@neofinancial/neo-framework';
import { Sentry } from '@neofinancial/neo-monitoring';
import { RedisClient } from '@neofinancial/neo-redis-client';

import {
  decodeAndVerify,
  validateToken,
  getAdminSession,
  AdminTokenPayload,
} from '../../src/lib/token-auth';
import { encode } from '../helpers/token.helper';

const testAdminSession = (overrides?: Partial<AdminSession>): AdminSession => ({
  adminUser: {
    id: 'admin-user-id',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'Example',
    picture: '',
    language: Language.EN,
    ...overrides?.adminUser,
  },
  sessionData: {
    id: 'admin-session-id',
    token: 'admin-token',
    tokenExpiresAt: addHours(new Date(), 12).toISOString(),
    ...overrides?.sessionData,
  },
});

const testAdminToken = (overrides?: Partial<AdminTokenPayload>): Partial<AdminTokenPayload> => ({
  adminId: 'admin-user-id',
  roles: [AuthorizationRole.SUPERUSER],
  requestSender: RequestSender.CONTROL_CENTER,
  ...overrides,
});

const mockRedis = stub<RedisClient>();

beforeAll(async (): Promise<void> => {
  jest.spyOn(Sentry, 'captureLowPriority').mockImplementationOnce(() => undefined);
  jest.spyOn(Sentry, 'captureCriticalPriority').mockImplementationOnce(() => undefined);
  reveal(mockRedis).getObject.mockResolvedValue(testAdminSession());
});

beforeEach(async (): Promise<void> => {
  jest.clearAllMocks();
});

describe('validateToken', () => {
  test('returns true when token is valid and session exists', async () => {
    const token = await encode(testAdminToken(), config.TOKEN_SECRET as string, '24h');

    await expect(validateToken(token, undefined, mockRedis)).resolves.toBe(true);
  });

  test('throws when secret is invalid', async () => {
    const token = await encode(testAdminToken(), 'FAKE_SECRET', '24h');

    await expect(validateToken(token, undefined, mockRedis)).rejects.toThrow(GraphQLError);
  });

  test('throws when token is expired', async () => {
    const token = await encode(testAdminToken(), config.TOKEN_SECRET as string, '0s');

    await expect(validateToken(token, undefined, mockRedis)).rejects.toThrow(GraphQLError);
  });

  test('throws when token is valid and session does not exist', async () => {
    reveal(mockRedis).getObject.mockResolvedValueOnce(undefined);

    const token = await encode(testAdminToken(), config.TOKEN_SECRET as string, '24h');

    await expect(validateToken(token, undefined, mockRedis)).rejects.toThrow(GraphQLError);
  });
});

describe('decodeAndVerify', () => {
  test('returns correct payload when secret matches', async () => {
    const token = await encode({ payload: 'bananas' }, config.TOKEN_SECRET as string, '24h');

    await expect(decodeAndVerify(token, config.TOKEN_SECRET as string)).resolves.toEqual({
      payload: 'bananas',
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

  test('fails when secret does not match', async () => {
    const token = await encode({ payload: 'bananas' }, config.TOKEN_SECRET as string, '24h');

    await expect(decodeAndVerify(token, 'other-token')).rejects.toThrow();
  });
});

describe('getAdminSession', () => {
  test('returns expected session when token is found in cache', async () => {
    const expectedSession = testAdminSession();

    reveal(mockRedis).getObject.mockResolvedValueOnce(expectedSession);

    const token = await encode(testAdminToken(), config.TOKEN_SECRET as string, '24h');
    const payload = { adminId: expectedSession.adminUser?.id } as AdminTokenPayload;

    const adminSession = await getAdminSession(token, payload, mockRedis);

    expect(adminSession).toEqual(expectedSession);
  });

  test('returns undefined when session not found in cache', async () => {
    reveal(mockRedis).getObject.mockResolvedValueOnce(undefined);

    const token = await encode(testAdminToken(), config.TOKEN_SECRET as string, '24h');
    const payload = { adminId: testAdminSession().adminUser?.id } as AdminTokenPayload;

    const adminSession = await getAdminSession(token, payload, mockRedis);

    expect(Sentry.captureLowPriority).toHaveBeenCalledTimes(0);
    expect(adminSession).not.toBeDefined();
  });

  test('returns undefined when session found in cache does not match payload', async () => {
    const expectedSession = testAdminSession();

    reveal(mockRedis).getObject.mockResolvedValueOnce(expectedSession);

    const token = await encode(testAdminToken(), config.TOKEN_SECRET as string, '24h');
    const payload = { adminId: 'not-matching-id' } as AdminTokenPayload;

    const adminSession = await getAdminSession(token, payload, mockRedis);

    expect(Sentry.captureLowPriority).toHaveBeenCalledTimes(1);
    expect(adminSession).toBeUndefined();
  });
});
