import config from 'config-dug';
import { FastifyRequest } from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';
import cookie from 'cookie';
import { UAParser } from 'ua-parser-js';
import { v4 as uuid } from 'uuid';
import { ApolloFastifyContextFunction } from '@as-integrations/fastify';

import {
  AdminContext,
  Client,
  ClientCategory,
  ClientPlatform,
  ContextType,
  Language,
  RequestSender,
  asyncLogger as logger,
} from '@neofinancial/neo-framework';

import { getAdminSessionData, getPermissions } from './token-auth';

interface RouteInterface extends RouteGenericInterface {
  Headers: {
    'x-client-locale'?: string;
    'x-forwarded-for'?: string;

    'user-agent'?: string;
  };
}

export type FastifyRequestExtension = FastifyRequest<RouteInterface>;

function getIpV4Address(request: FastifyRequestExtension): string {
  let ipAddress: string = request.headers['x-forwarded-for'] || request.ip || '::1';

  // Node quirk sometimes prefix IP with ffff
  if (ipAddress.slice(0, 7) === '::ffff:') {
    ipAddress = ipAddress.slice(7);
  }

  // Make sure we use v4 localhost for localhost
  if (ipAddress === '::1') {
    ipAddress = 'localhost';
  }

  return ipAddress;
}

const getOsVersion = (userAgent?: string, env = process.env.NODE_ENV as string): string => {
  const uaBrowser = new UAParser(userAgent).getBrowser();

  if (uaBrowser.name && uaBrowser.version) {
    return `${uaBrowser.name}-${uaBrowser.version}`;
  } else if (['development', 'test'].includes(env)) {
    return env;
  } else {
    throw new Error('user-agent must be provided');
  }
};

const getLanguage = (localeHeader?: string): Language => {
  if (localeHeader?.toLowerCase().startsWith('fr')) {
    return Language.FR;
  }

  return Language.EN;
};

const extractClientFromHeaders = (request: FastifyRequestExtension): Client => {
  return {
    platform: ClientPlatform.WEB,
    category: ClientCategory.ADMIN,
    ipAddress: getIpV4Address(request),
    osVersion: getOsVersion(request.headers['user-agent']),
    language: getLanguage(request.headers['x-client-locale']),
  };
};

const getCookieToken = (request: FastifyRequestExtension): string | undefined => {
  if (request?.headers?.cookie) {
    return cookie.parse(request.headers.cookie)[config.SESSION_COOKIE_NAME_ADMIN as string];
  }
};

const buildAdminContext = (): ApolloFastifyContextFunction<AdminContext> => {
  return async (req: FastifyRequest): Promise<AdminContext> => {
    const request = req as FastifyRequestExtension;

    const requestId = uuid();
    const token = getCookieToken(request);
    const session = token ? await getAdminSessionData(token) : undefined;
    let permissions: string[] = [];

    if (session?.adminUser) {
      permissions = await getPermissions(session.adminUser.id);
    }

    try {
      const client = extractClientFromHeaders(request);

      client.category = ClientCategory.ADMIN;

      return {
        ...session,
        queryCost: 0,
        permissions,
        contextType: ContextType.ADMIN,
        requestId,
        client,
        requestSender: RequestSender.CONTROL_CENTER,
      };
    } catch (error) {
      if (error instanceof Error) {
        // Missing client and app header and user agent, log but don't Sentry
        logger.warn(error);
      } else {
        logger.error(`Caught unknown error: ${error}`);
      }

      throw error;
    }
  };
};

export { buildAdminContext, getCookieToken, extractClientFromHeaders, getOsVersion, getIpV4Address };
