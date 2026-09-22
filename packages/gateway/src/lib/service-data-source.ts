/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { GraphQLDataSourceProcessOptions, RemoteGraphQLDataSource } from '@apollo/gateway';
import { GraphQLDataSourceRequestKind } from '@apollo/gateway/dist/datasources/types';
import { GatewayGraphQLResponse } from '@apollo/server-gateway-interface';
import { GraphQLError } from 'graphql';
import merge from 'lodash/merge';
import config from 'config-dug';

import { Sentry } from '@neofinancial/neo-monitoring';
import { AdminContext, asyncLogger as logger, isDirectiveValidationError } from '@neofinancial/neo-framework';
import { signContext } from '@neofinancial/neo-graphql-tools';

import { validateToken } from './token-auth';

const SERVICE_TO_TRIAGE_TEAM_MAPPING: { [service: string]: string } = {
  'reward-service': 'rewards',
  'user-service': 'engineering',
  'transaction-service': 'growth',
};

interface GraphQLErrorWithExtensions extends Omit<GraphQLError, 'extensions'> {
  extensions: {
    response?: {
      body?: {
        errors?: unknown;
      };
      status?: number;
    };
  };
}

interface GraphQLRequest {
  url?: string;
}

const parseGraphQLResponseError = (error: GraphQLErrorWithExtensions): any => {
  if (error.extensions?.response?.body?.errors) {
    return error.extensions?.response?.body?.errors;
  } else if (error.extensions?.response) {
    return error.extensions?.response;
  } else {
    return error;
  }
};

const isBadRequest = (status?: number): boolean => {
  return status ? status >= 400 && status < 500 : false;
};

const getTriageTeamTagByUrl = (url: string): string | undefined => {
  const neoServiceUrlRegEx = /^https?:\/\/([\w-]+)\..*$/;

  const matches = neoServiceUrlRegEx.exec(url);

  if (matches && matches.length >= 2 && SERVICE_TO_TRIAGE_TEAM_MAPPING[matches[1]]) {
    return SERVICE_TO_TRIAGE_TEAM_MAPPING[matches[1]];
  }
};

const logHTTPError = (error: GraphQLErrorWithExtensions, url?: string): void => {
  logger.debug(`Logging error contacting url ${url}`);

  // Directive validation errors are 400s from subgraphs that don't need to be Sentried.
  if (isDirectiveValidationError(error)) return;

  const triageTeam = url ? getTriageTeamTagByUrl(url) : undefined;

  if (isBadRequest(error.extensions?.response?.status)) {
    logger.error(
      'HTTP Bad Request occurred. This indicates a client has a bug and is sending a bad request or someone is hitting our API manually.',
      parseGraphQLResponseError(error)
    );
  } else {
    logger.error(
      'HTTP error while making graphql request. This indicates a service or vendor is down or timing out.',
      parseGraphQLResponseError(error)
    );
    Sentry.captureCriticalPriority(error, {
      triageTeamOverride: triageTeam,
    });
  }
};

class AdminServiceDataSource extends RemoteGraphQLDataSource<AdminContext> {
  public async willSendRequest(options: GraphQLDataSourceProcessOptions<AdminContext>): Promise<void> {
    let contextType, client, requestId, requestSender, adminUser, sessionData, permissions;

    if (options.kind === GraphQLDataSourceRequestKind.INCOMING_OPERATION) {
      const context = options.incomingRequestContext.context;

      if (context?.sessionData?.token) {
        await validateToken(context.sessionData.token, context.adminUser?.id);
        options.request.http?.headers.set('Authorization', context.sessionData.token);
      } else {
        // Since there is no token let's make sure there is nothing in the Authorization header
        options.request.http?.headers.delete('Authorization');
      }

      ({ contextType, client, requestId, requestSender, adminUser, sessionData, permissions } =
        options.incomingRequestContext.context);
    }

    const contextObject = {
      contextType,
      requestId,
      client,
      requestSender,
      adminUser,
      sessionData,
      permissions,
    };

    const contextSignature = signContext(contextObject, config.TOKEN_SECRET as string);

    options.request.extensions = {
      ...options.request.extensions,
      context: contextObject,
      contextSignature,
    };
  }

  public async didReceiveResponse({
    response,
    context,
  }: {
    response: GatewayGraphQLResponse;
    context: AdminContext;
  }): Promise<GatewayGraphQLResponse> {
    if (response.extensions?.queryCost) {
      context.queryCost = context.queryCost
        ? context.queryCost + response.extensions.queryCost
        : response.extensions.queryCost;
    }

    // Extensions will include a token if we delegated a login to user-service via Federation.
    if (response.extensions?.adminToken && response.extensions.adminTokenExpiresAt) {
      context.sessionData = merge(context.sessionData || {}, {
        token: response.extensions.adminToken,
        tokenExpiresAt: response.extensions.adminTokenExpiresAt,
      });
    }

    return response;
  }

  public didEncounterError(error: GraphQLErrorWithExtensions, request: GraphQLRequest): void {
    logHTTPError(error, request.url);

    throw error;
  }
}

export { AdminServiceDataSource, getTriageTeamTagByUrl };
