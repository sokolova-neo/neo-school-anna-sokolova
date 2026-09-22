process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const APP_ENV = (process.env.APP_ENV = process.env.APP_ENV || 'development') as AppEnv;

import config from 'config-dug';

import {
  AdminContext,
  AppEnv,
  syncLogger as logger,
  Mongoose,
  NeoServer,
  NeoSubgraphApolloServer,
  Sentry,
} from '@neofinancial/neo-framework';

import { getDependencyRegistryInstance } from './configuration/dependency-registry';
import { QueueConsumerManager } from './application/consumers';
import { getSchema } from './application/api/admin/schema';
import { contextPlugin } from './lib/context-plugin';

const dependencyRegistry = getDependencyRegistryInstance();

const queryCostLimit = config.GRAPHQL_QUERY_COST_LIMIT as number;

const apolloServer = new NeoSubgraphApolloServer<AdminContext>({
  queryCostLimit,
  schema: getSchema(),
  sentry: Sentry,
  additionalPlugins: [contextPlugin],
  jwtSecrets: [config.TOKEN_SECRET as string],
  contextValidationSecrets: [config.TOKEN_SECRET as string],
});

const server = new NeoServer({
  config: {
    PORT: config.PORT as number,
    APP_ENV,
    EVENT_CONSUMERS_ENABLED: config.EVENT_CONSUMERS_ENABLED as boolean,
    APP_SHUTDOWN_DELAY_MS: 1,
  },
  logger,
  sentry: { client: Sentry, options: { triageTeam: config.SENTRY_TRIAGE_TEAM as string } },
  databases: [
    {
      name: 'db',
      instance: dependencyRegistry.resolve(Mongoose),
    },
  ],
  queueConsumerManager: dependencyRegistry.resolve(QueueConsumerManager),
  neoApolloServers: [{ server: apolloServer, path: '/graphql' }],
});

(async (): Promise<void> => {
  await server.initialize();
})();
