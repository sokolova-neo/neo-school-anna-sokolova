/* eslint-disable unicorn/no-nested-ternary */

import { FastifyRequest, FastifyReply } from 'fastify';

const commitHash =
  process.env.NODE_ENV === 'development'
    ? 'development'
    : process.env.COMMIT_HASH
    ? process.env.COMMIT_HASH
    : 'unknown';

const statusController = (_: FastifyRequest, reply: FastifyReply): void => {
  reply.send({
    name: process.env.SERVICE_NAME || 'gateway',
    status: 'OK',
    info: {
      commitHash,
    },
  });
};

export default statusController;
