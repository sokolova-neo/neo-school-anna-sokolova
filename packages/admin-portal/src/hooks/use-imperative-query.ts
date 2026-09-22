import { type DocumentNode } from 'graphql';
import { useCallback, useState } from 'react';
import {
  type ApolloQueryResult,
  type OperationVariables,
  type QueryHookOptions,
} from '@apollo/client';
import { NetworkStatus, useQuery } from '@apollo/client';

/**
 * This is a workaround because lazy queries suck
 * https://github.com/apollographql/react-apollo/issues?utf8=%E2%9C%93&q=is%3Aissue+sort%3Aupdated-desc++lazy+
 * This is effectively a thin wrapper around useQuery that calls it exactly once and returns a promise with the result
 *
 * Usage:
 *
 * import { useSomeQuery } from '../types/schema.d.ts
 *
 * const Component = () => {
 *   const makeQuery = useImperativeQuery(useSomeQuery)
 *   ...
 *   const { data, error } = await makeQuery(variables)
 * }
 */

type ApolloQueryResultOptionalData<TData> = Omit<
  ApolloQueryResult<TData>,
  'data'
> & { data?: TData };

export type ImperativeQueryResult<TData, TVariables> = [
  (variables?: TVariables) => Promise<ApolloQueryResultOptionalData<TData>>,
  ApolloQueryResultOptionalData<TData>,
];

function useImperativeQuery<TData, TVariables extends OperationVariables>(
  query: DocumentNode,
  options: QueryHookOptions<TData, TVariables> = {},
): ImperativeQueryResult<TData, TVariables> {
  const [queryResult, setQueryResult] = useState<
    ApolloQueryResultOptionalData<TData>
  >({
    loading: false,
    networkStatus: NetworkStatus.refetch,
    partial: false,
  });

  const { loading, refetch } = useQuery<TData, TVariables>(query, {
    ...options,
    skip: true, // secret sauce so this only runs on refetch
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  const imperativelyCallQuery = useCallback(
    async (variables?: TVariables): Promise<ApolloQueryResult<TData>> => {
      const result = await refetch(variables);

      setQueryResult(result);

      return result;
    },
    [refetch],
  );

  return [imperativelyCallQuery, { ...queryResult, loading }];
}

export { useImperativeQuery };
