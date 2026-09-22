import { type ApolloClient, type NormalizedCacheObject } from '@apollo/client';

import { logger } from '../logger';
import { isBrowser } from '../is-browser';
import { buildClient } from './build-client';

// adapted from https://www.apollographql.com/blog/building-a-next-js-app-with-apollo-client-slash-graphql/
let apolloClientSingleton: ApolloClient<NormalizedCacheObject>;

const initializeApollo = (): ApolloClient<NormalizedCacheObject> => {
  if (isBrowser() && apolloClientSingleton) {
    return apolloClientSingleton;
  }

  logger.debug(
    `Building new Apollo client in ${isBrowser() ? 'browser' : 'server'} mode`,
  );

  const apolloClient = buildClient();

  if (isBrowser()) {
    apolloClientSingleton = apolloClient;
  }

  return apolloClient;
};

export { initializeApollo };
