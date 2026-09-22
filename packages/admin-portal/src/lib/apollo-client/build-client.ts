import { InMemoryCache } from '@apollo/client';
import { SerializableApolloClient } from './apolllo-client';

import generatedIntrospection from './__graphql/possible-types.generated';

const buildClient = (): SerializableApolloClient =>
  new SerializableApolloClient({
    name: 'Admin Portal',
    version: '1.0.0',
    uri: 'http://localhost:8010/graphql',
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
    },
    connectToDevTools: false,
    cache: new InMemoryCache({
      addTypename: true,
      possibleTypes: generatedIntrospection.possibleTypes,
    }),
    ssrMode: false,
  });

export { buildClient };
