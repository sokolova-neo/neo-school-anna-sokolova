import { gql } from '@apollo/client';

import { type Transaction } from '../../../types/transaction';
import {
  TransactionRelativeQueryFilterOperator,
  TransactionRelativeQuerySortDirection,
  TransactionRelativeQueryValueType,
} from '../../../types/__graphql/enums.generated.d';
import { type RelativeCursorQueryInput } from '../../../hooks/use-relative-cursor-query';
import { generateLazyQueryHook } from '../../../hooks/queries/generate-lazy-query-hook';
import { generateQueryHook } from '../../../hooks/queries/generate-query-hook';
import {
  type UserTransactionsQuery,
  type UserTransactionsQueryVariables,
} from './__graphql/use-user-transactions-query.generated.d';

const userTransactionsQuery = gql`
  query UserTransactions(
    $userId: ObjectID!
    $query: TransactionRelativeQueryInput!
  ) {
    user(id: $userId) {
      transactions(input: $query) {
        results {
          id
          amountCents
          status
          category
          transactionDate
        }
        hasNextPage
        primaryCursor {
          cursor
        }
        secondaryCursor {
          cursor
        }
      }
    }
  }
`;

const mapToQueryInput = (
  input: RelativeCursorQueryInput,
): UserTransactionsQueryVariables['query'] => ({
  primaryCursor: {
    ...input.primaryCursor,
    sort: TransactionRelativeQuerySortDirection[input.primaryCursor.sort],
    type: TransactionRelativeQueryValueType[input.primaryCursor.type],
  },
  secondaryCursor: input.secondaryCursor
    ? {
        ...input.secondaryCursor,
        sort: TransactionRelativeQuerySortDirection[input.secondaryCursor.sort],
        type: TransactionRelativeQueryValueType[input.secondaryCursor.type],
      }
    : undefined,
  limit: input.limit,
  filter: input.filter?.map((filter) => ({
    ...filter,
    operator: TransactionRelativeQueryFilterOperator[filter.operator],
    type: TransactionRelativeQueryValueType[filter.type],
  })),
});

const mapToTransaction = (
  queryTransaction: UserTransactionsQuery['user']['transactions']['results'][number],
): Transaction => ({
  id: queryTransaction.id,
  amountCents: queryTransaction.amountCents,
  transactionDate: new Date(queryTransaction.transactionDate),
  status: queryTransaction.status,
  category: queryTransaction.category,
});

const useUserTransactionsQuery = generateQueryHook<
  UserTransactionsQueryVariables,
  UserTransactionsQuery
>(userTransactionsQuery);

const useUserTransactionsLazyQuery = generateLazyQueryHook<
  UserTransactionsQueryVariables,
  UserTransactionsQuery
>(userTransactionsQuery);

export {
  mapToTransaction,
  mapToQueryInput,
  useUserTransactionsQuery,
  useUserTransactionsLazyQuery,
};
