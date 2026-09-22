import { type ApolloLink, type NormalizedCacheObject } from '@apollo/client';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import isomorphicUnfetch from 'isomorphic-unfetch';
import generatedPossibleTypes from '../../src/lib/apollo-client/__graphql/possible-types.generated';

const httpLink = (endpoint: string): ApolloLink => {
  const link = new HttpLink({
    uri: endpoint,
    fetch: isomorphicUnfetch,
  });

  return link;
};

const testCache = new InMemoryCache({
  addTypename: true,
  possibleTypes: generatedPossibleTypes.possibleTypes,
});

const buildTestClient = (): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({
    name: 'Test',
    version: '9001.69.420',
    link: httpLink('http://localhost:42069/'),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
    },
    connectToDevTools: false,
    cache: testCache,
    ssrMode: false,
  });

export { buildTestClient, testCache };
