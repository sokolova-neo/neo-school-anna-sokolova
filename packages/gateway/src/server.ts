/* eslint-disable no-console,promise/no-callback-in-promise */

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

type Env = 'development' | 'integration' | 'staging' | 'production';

const APP_ENV = (process.env.APP_ENV = process.env.APP_ENV || 'development') as Env;

import config from 'config-dug';
import '@neofinancial/neo-apm';
import fastify, { FastifyInstance } from 'fastify';
import fastifyHttpProxy from '@fastify/http-proxy';
import chalk from 'chalk';
import exitHook from 'async-exit-hook';
import { syncLogger as logger } from '@neofinancial/neo-framework';
import { Sentry, initializeSentry } from '@neofinancial/neo-monitoring';

import { promisify } from 'util';

import createApp from './app';

/* TODO: remove this once we have figured out what is causing this
 https://neofinancial.slack.com/archives/CTC1Y3YHY/p1676859873504109 */
Error.stackTraceLimit = 100;

initializeSentry({ triageTeam: 'infra' });

const sleep = promisify(setTimeout);
const isDevelopment = true;
const PORT: number = config.PORT as number;
const UPSTREAM_PORT = config.UPSTREAM_PORT as number;
const APP_SHUTDOWN_WAIT_MS: number = config.APP_SHUTDOWN_WAIT_MS as number;

let app: FastifyInstance;

const printStartupMessage = (): void => {
  if (process.env.COMMIT_HASH) {
    logger.info(
      chalk.blue(`Service is running at http://localhost:${PORT} in ${APP_ENV} mode [${process.env.COMMIT_HASH}]`),
    );
  } else {
    logger.info(chalk.blue(`Service is running at http://localhost:${PORT} in ${APP_ENV} mode`));
  }
};

const startDevServer = async (): Promise<void> => {
  let upstreamApp: FastifyInstance;

  app = fastify();

  try {
    upstreamApp = await createApp({});

    upstreamApp.listen({ port: UPSTREAM_PORT, host: '0.0.0.0' }, printStartupMessage);
  } catch (error) {
    logger.error(String(error));
    process.exit(1);
  }

  app.register(fastifyHttpProxy, {
    upstream: `http://localhost:${UPSTREAM_PORT}`,
  });

  app.get('/notify/*', async (_, reply) => {
    reply.code(200).send();

    await upstreamApp.close();
    upstreamApp = await createApp({});
    upstreamApp.listen({ port: UPSTREAM_PORT, host: '0.0.0.0' }, printStartupMessage);
  });

  app.listen({ port: PORT, host: '0.0.0.0' });
};

const handleShutdownError = (error: unknown): void => {
  logger.error(chalk.red(error));
  Sentry.captureException(error);
};

const stopListening = async (): Promise<void> => {
  try {
    if (app) {
      logger.info(chalk.blue('Closing Fastify'));

      await app.close();
      logger.info(chalk.blue('Finished closing Fastify'));
    }
  } catch (error) {
    handleShutdownError(error as Error);
  }
};

const shutdownServer = async (): Promise<void> => {
  logger.info(chalk.blue(`Starting server shutdown process`));

  await stopListening();

  logger.info(chalk.blue(`App closed to new connections`));

  await sleep(APP_SHUTDOWN_WAIT_MS);

  logger.info(chalk.blue(`Shutdown finished`));
};

(async (): Promise<void> => {
  if (isDevelopment) {
    return startDevServer();
  }

  try {
    app = await createApp({
      noRemote: process.env.DISABLE_REMOTE === 'true',
    });
  } catch (error) {
    logger.error(String(error));
    process.exit(1);
  }

  // Must be set to avoid issues with AWS ALB keepalive
  app.server.keepAliveTimeout = 65 * 1000; // must be > AWS ALB keepalive (60s)
  app.server.headersTimeout = 70 * 1000; // must be > keepAliveTimeout

  app.listen({ port: PORT, host: '0.0.0.0' }, printStartupMessage);
})();

exitHook((callback: () => void): void => {
  shutdownServer()
    .then(() => callback())
    .catch((error: Error) => {
      logger.error(error.message, error);
      Sentry.captureException(error);
    });
});

exitHook.uncaughtExceptionHandler((error: Error): void => {
  logger.error('uncaught exception', error);
  Sentry.captureException(error);
});

exitHook.unhandledRejectionHandler((reason: unknown): void => {
  if (reason && reason instanceof Error) {
    logger.error('unhandled rejection', reason as Error);
    Sentry.captureException(reason as Error);
  } else if (reason && typeof reason === 'string') {
    logger.error(reason);
    Sentry.captureException(new Error(reason));
  } else if (reason && reason instanceof Object) {
    logger.error('unhandled rejection', reason);
  } else {
    console.error(reason);
  }
});
