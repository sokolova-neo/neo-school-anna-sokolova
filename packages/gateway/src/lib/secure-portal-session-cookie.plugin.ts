import config from 'config-dug';
import cookie, { CookieSerializeOptions } from 'cookie';

import { AdminContext, ClientCategory } from '@neofinancial/neo-framework';
import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContextWillSendResponse,
  GraphQLRequestListener,
  GraphQLResponse,
} from '@apollo/server';

type LogoutResponse = GraphQLResponse<{ logout: { success: true } }>;

type ContextMissingSessionData = BaseContext & { sessionData: undefined };

type ContextWithSessionData = BaseContext & {
  sessionData: {
    token: string;
    tokenExpiresAt: string;
  };
};

const securePortalDomain = config.SECURE_PORTAL_DOMAIN as string;
const sessionCookieDomain = config.ADMIN_SESSION_COOKIE_DOMAIN as string;

const cookieConfig: CookieSerializeOptions = {
  secure: true,
  sameSite: 'none',
  httpOnly: true,
  domain: sessionCookieDomain,
};

const isAdminContext = (context: unknown): context is AdminContext => {
  return (context as AdminContext)?.client?.category === ClientCategory.ADMIN;
};

const isLogoutResponse = (
  response: GraphQLRequestContextWillSendResponse<BaseContext>['response']
): response is LogoutResponse => {
  const res = response as LogoutResponse;

  return res.body?.kind === 'single' && res.body?.singleResult.data?.logout?.success === true;
};

const isContextMissingSessionData = (contextValue: BaseContext): contextValue is ContextMissingSessionData => {
  const context = contextValue as ContextMissingSessionData;

  return context.sessionData === undefined;
};

const isContextWithSessionData = (contextValue: BaseContext): contextValue is ContextWithSessionData => {
  const context = contextValue as ContextWithSessionData;

  return !!context.sessionData?.token && !!context.sessionData?.tokenExpiresAt;
};

const createLoggedOutCookie = (cookieName: string): string =>
  cookie.serialize(cookieName, '', { ...cookieConfig, expires: new Date(0) });

// Setting 'expires' to undefined makes this a "session cookie" that will be discarded automatically by the browser
const createSessionCookie = (cookieName: string, contextValue: ContextWithSessionData): string =>
  cookie.serialize(cookieName, contextValue.sessionData.token, {
    ...cookieConfig,
    expires: isAdminContext(contextValue) ? new Date(contextValue.sessionData.tokenExpiresAt) : undefined,
  });

const determineCookieValue = (
  cookieName: string,
  response: GraphQLRequestContextWillSendResponse<BaseContext>['response'],
  contextValue: BaseContext
): string | undefined => {
  if (!isAdminContext(contextValue) && isLogoutResponse(response)) {
    return createLoggedOutCookie(cookieName);
  }

  if (!isAdminContext(contextValue) && isContextMissingSessionData(contextValue)) {
    return createLoggedOutCookie(cookieName);
  }

  if (isContextWithSessionData(contextValue)) {
    return createSessionCookie(cookieName, contextValue);
  }
};

const shouldOverrideOrigin = (origin: string): boolean => {
  return origin.endsWith(securePortalDomain) || origin.endsWith(sessionCookieDomain);
};

const getSecureSessionCookieWillSendResponse = (
  cookieName: string
): ((requestContext: GraphQLRequestContextWillSendResponse<BaseContext>) => Promise<void>) => {
  const sessionCookieWillSendResponse = async ({
    request,
    response,
    contextValue,
  }: GraphQLRequestContextWillSendResponse<BaseContext>): Promise<void> => {
    if (!securePortalDomain || !cookieName || !response) {
      return;
    }

    const origin = request.http?.headers.get('origin');

    if (!origin || !shouldOverrideOrigin(origin)) {
      return;
    }

    const cookieValue = determineCookieValue(cookieName, response, contextValue);

    if (cookieValue) {
      response.http?.headers.set('Set-Cookie', cookieValue);
    }
  };

  return sessionCookieWillSendResponse;
};

const secureSessionCookiePlugin = (cookieName: string): ApolloServerPlugin => ({
  requestDidStart: async (): Promise<GraphQLRequestListener<BaseContext>> => {
    return {
      willSendResponse: getSecureSessionCookieWillSendResponse(cookieName),
    };
  },
});

export { secureSessionCookiePlugin, getSecureSessionCookieWillSendResponse };
