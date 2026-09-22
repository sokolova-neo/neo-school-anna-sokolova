import config from 'config-dug';

import { isLive, isDevelopment } from '@neofinancial/neo-env';
import { NeoGatewayApolloServer } from '@neofinancial/neo-graphql-tools';

import { buildService, getServices } from '../lib/service-list';
import { secureSessionCookiePlugin } from '../lib/secure-portal-session-cookie.plugin';
import { composeLocalSchema } from '../lib/local-composition';

const services = [
  { name: 'reward-service', url: `${config.REWARD_SERVICE_URL as string}/graphql` },
  { name: 'transaction-service', url: `${config.TRANSACTION_SERVICE_URL as string}/graphql` },
  { name: 'user-service', url: `${config.USER_SERVICE_URL as string}/graphql` },
];

const getDevelopmentSdl = async (): Promise<string> => {
  const { runningServices, offlineServices } = await getServices(services);

  const supergraphSdl = await composeLocalSchema({
    runningServices,
    offlineServices,
    schemaFileName: 'schema.graphql',
  });

  return supergraphSdl;
};

const getAdminApi = async (): Promise<NeoGatewayApolloServer> => {
  const apolloStudioConfiguration = isLive
    ? {
        graphRef: `${config.APOLLO_GRAPH_ID as string}@${process.env.APP_ENV}`,
        key: config.APOLLO_KEY_ADMIN as string,
      }
    : undefined;

  const cookieName = config.SESSION_COOKIE_NAME_ADMIN as string;

  const additionalPlugins = [secureSessionCookiePlugin(cookieName)];

  const server = new NeoGatewayApolloServer({
    gatewayName: 'gateway',
    buildService: buildService(),
    supergraphSdl: isDevelopment ? await getDevelopmentSdl() : undefined,
    apolloStudioConfiguration,
    metricsReporterPrefix: config.METRICS_REPORTER_PREFIX as string,
    cookieName,
    additionalPlugins,
  });

  await server.start();

  return server;
};

export { getAdminApi };
