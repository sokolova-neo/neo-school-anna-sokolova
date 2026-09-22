import {
  useMemo,
  useContext,
  useEffect,
  type PropsWithChildren,
  type ReactElement,
} from 'react';

import { type NormalizedCache, type ApolloClient } from '@apollo/client';
import { getApolloContext } from '@apollo/client';

import { initializeApollo } from '../lib/apollo-client/initialize';
import { isBrowser } from '../lib/is-browser';

const apolloContext = getApolloContext();

const ApolloClientProvider = ({
  children,
}: PropsWithChildren): ReactElement => {
  const higherUpContext = useContext(apolloContext);

  const client = useMemo(() => ({ client: initializeApollo() }), []);

  useEffect(() => {
    if (isBrowser()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__APOLLO_CLIENT__ = higherUpContext.client ?? client;
    }
  }, [client, higherUpContext.client]);

  if (higherUpContext.client) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return (
    <apolloContext.Provider value={client}>{children}</apolloContext.Provider>
  );
};

const useApolloClient = (): ApolloClient<NormalizedCache> => {
  const { client } = useContext(apolloContext);

  if (!client) {
    throw new Error(
      'Tried to access Apollo Client outside of ApolloClientProvider',
    );
  }

  // Type from apollo is more generic but we can be assured its a NormalizedCache
  return client as ApolloClient<NormalizedCache>;
};

export { ApolloClientProvider, useApolloClient };
