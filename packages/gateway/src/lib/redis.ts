import { RedisObjectStore, RedisClient, RedisCluster, RedisClientConfig } from '@neofinancial/neo-redis-client';
import config from 'config-dug';
import { asyncLogger as logger } from '@neofinancial/neo-framework';

const clientConfig: RedisClientConfig = {
  endpoint: config.REDIS_ENDPOINT as string,
  enableTls: config.REDIS_TLS as boolean,
  password: config.REDIS_PASSWORD as string,
};

const dnsCacheSettings = {
  enabled: config.REDIS_DNS_CACHE_ENABLED as boolean,
  maxTtlSeconds: config.REDIS_DNS_CACHE_TTL_SECONDS as number,
};

const redisClient =
  (config.REDIS_CLUSTER_MODE_ENABLED as boolean) === true
    ? new RedisCluster({
        ...clientConfig,
        dnsCacheSettings,
      })
    : new RedisClient(clientConfig);

const connect = async (): Promise<RedisObjectStore> => {
  logger.info(
    `Connecting to Redis ${clientConfig.endpoint}, clustered ${config.REDIS_CLUSTER_MODE_ENABLED as string}, tls ${
      clientConfig.enableTls
    }`,
    { clusterModeDnsCacheSettings: dnsCacheSettings }
  );

  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('Could not connect to Redis', { error });

    throw error;
  }

  return redisClient;
};

export { connect, RedisObjectStore };
export default redisClient;
