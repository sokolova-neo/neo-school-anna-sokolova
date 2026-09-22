import { RedisObjectStore } from '../../lib/redis';

declare module 'fastify' {
  export interface FastifyInstance<> {
    redis: RedisObjectStore;
  }
}
