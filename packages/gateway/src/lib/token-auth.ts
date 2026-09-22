import config from 'config-dug';
import { GraphQLError } from 'graphql';
import jsonwebtoken, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import promisifyAll from 'util-promisifyall';

import { AdminSession, AuthorizationRole, RequestSender, asyncLogger as logger } from '@neofinancial/neo-framework';
import { Sentry } from '@neofinancial/neo-monitoring';
import { makeDiscoverer } from '@neofinancial/neo-permission-groups-sdk';

import redis from './redis';
import { adminContextFactory } from '../../test/factories/admin-context.factory';

export interface AdminTokenPayload {
  adminId: string;
  roles: AuthorizationRole[];
  requestSender: RequestSender;
  type: string;
  iat: number;
  exp: number;
}

export type AdminSessionData = AdminSession & { requestSender: RequestSender };

const jwt = promisifyAll(jsonwebtoken);

const decodeAndVerify = <T>(token: string, secret: string): Promise<T> => {
  return jwt.verifyAsync(token, secret);
};

const validateToken = async (token: string, adminId?: string, redisClient = redis): Promise<boolean> => {
  try {
    await decodeAndVerify(token, config.TOKEN_SECRET as string);

    const session = await redisClient.getObject<AdminSession>(token);

    if (!session) {
      const errorMessage = 'Session not found. Assuming invalid token.';

      logger.debug(errorMessage, { adminId });

      throw new JsonWebTokenError(errorMessage);
    }
  } catch (error) {
    // Don't Sentry token errors
    if (!(error instanceof JsonWebTokenError || error instanceof TokenExpiredError)) {
      logger.error(`Could not verify token`, { adminId, error });

      Sentry.captureException(error);
    }

    throw new GraphQLError('Invalid Credentials', {
      extensions: {
        code: 'UNAUTHORIZED',
      },
    });
  }

  return true;
};

const getAdminSession = async (
  token: string,
  payload: AdminTokenPayload,
  redisClient = redis
): Promise<AdminSession | undefined> => {
  if (redisClient) {
    const adminSession = await redisClient.getObject<AdminSession>(token);

    if (!adminSession) {
      logger.debug('Session not found. Assuming invalid token.', { adminId: payload.adminId });

      return;
    } else if (adminSession.adminUser?.id !== payload.adminId) {
      const error = new Error('Admin session admin id does not match token admin id');

      logger.error(error.message, {
        sessionCustomerUserId: adminSession.adminUser?.id,
        tokenCustomerUserId: payload.adminId,
      });

      Sentry.captureLowPriority(error);

      return;
    }

    return adminSession;
  } else {
    const error = new Error('Redis client does not exist when getting admin session');

    logger.error(error.message, { admin: payload.adminId });

    Sentry.captureCriticalPriority(error);

    return;
  }
};

const getAdminSessionData = async (
  _token: string,
  _getAdminSessionFromCache = getAdminSession
): Promise<AdminSession | undefined> => {
  const adminContext = adminContextFactory.build();

  return adminContext;
};

const permissions = makeDiscoverer(redis);

const getPermissions = async (adminId: string): Promise<string[]> => {
  try {
    return permissions(adminId);
  } catch (caught) {
    logger.error('Unable to fetch permissions for a user from admin gateway', { error: caught, adminId });
  }

  return [];
};

export { decodeAndVerify, validateToken, getAdminSession, getAdminSessionData, getPermissions };
