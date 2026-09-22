import config from 'config-dug';
import fastify, { FastifyInstance } from 'fastify';
import fastifyApollo from '@as-integrations/fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';

import { AdminContext, syncLogger as logger } from '@neofinancial/neo-framework';
import { isProduction } from '@neofinancial/neo-env';

import { connect as connectRedis } from './lib/redis';
import { getAdminApi } from './api/admin-api';
import statusController from './controllers/status.controller';
import { initializeFlags } from './lib/feature-flags';
import { buildAdminContext } from './lib/build-context';

export interface AppOptions {
  noRemote?: boolean;
  noRedis?: boolean;
}

const corsOptions = {
  credentials: true,
  origin: (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void): void => {
    if (process.env.APP_ENV === 'development' || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else if (!origin || (origin && (config.CORS_ALLOWLISTED_ORIGINS as string).split(',').includes(origin))) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`), false);
    }
  },
};

const createApp = async ({ noRedis = true, noRemote }: AppOptions): Promise<FastifyInstance> => {
  const app: FastifyInstance = fastify({
    trustProxy: true,
  });

  if (!noRedis) {
    logger.info('Connecting to Redis');

    app.decorate('redis', await connectRedis());
  }

  await initializeFlags();
  app.register(fastifyCors, corsOptions);
  app.register(fastifyHelmet, {
    contentSecurityPolicy: isProduction,
    noSniff: true,
  });

  if (!noRemote) {
    app.register(fastifyApollo<AdminContext>(await getAdminApi()), {
      path: '/graphql',
      context: buildAdminContext(),
    });
  }

  app.get('/status', statusController);

  await app.ready();

  return app;
};

export default createApp;
