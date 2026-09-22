import { useCallback, useEffect, useState } from 'react';
import { type Transaction } from '../../../types/transaction';
import {
  mapToQueryInput,
  mapToTransaction,
  useUserTransactionsLazyQuery,
} from '../api/use-user-transactions-query';
import {
  RelativeCursorQuerySortDirection,
  RelativeCursorQueryValueType,
  useRelativeCursorQuery,
  type InitialRelativeCursorQueryValue,
} from '../../../hooks/use-relative-cursor-query';

export interface UseUserTransactionsResult {
  transactions: Transaction[];
  loading: boolean;
  errorMessage?: string;
  showLoadMore: boolean;
  fetchTransactions: () => void;
}

const useUserTransactions = ({
  userId,
}: {
  userId: string;
}): UseUserTransactionsResult => {
  const initialQueryValue: InitialRelativeCursorQueryValue = {
    filter: [],
    limit: 5,
    primaryCursor: {
      sort: RelativeCursorQuerySortDirection.DESC,
      field: 'transactionDate',
      type: RelativeCursorQueryValueType.DATE,
    },
    secondaryCursor: {
      sort: RelativeCursorQuerySortDirection.DESC,
      field: '_id',
      type: RelativeCursorQueryValueType.OBJECT_ID,
    },
  };

  const { relativeCursorQuery, setCursor } =
    useRelativeCursorQuery(initialQueryValue);
  const [getUserTransactions, { data, error }] = useUserTransactionsLazyQuery({
    variables: {
      query: mapToQueryInput(relativeCursorQuery),
      userId,
    },
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const newTransactions =
      data?.user.transactions.results.map(mapToTransaction) ?? [];
    setTransactions([...transactions, ...newTransactions]);
    setCursor({
      primaryCursor: {
        sort: RelativeCursorQuerySortDirection.DESC,
        field: 'transactionDate',
        type: RelativeCursorQueryValueType.DATE,
        cursor: data?.user.transactions.primaryCursor.cursor ?? undefined,
      },
      secondaryCursor: {
        sort: RelativeCursorQuerySortDirection.DESC,
        field: '_id',
        type: RelativeCursorQueryValueType.OBJECT_ID,
        cursor: data?.user.transactions.secondaryCursor?.cursor ?? undefined,
      },
    });
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const fetchTransactions = useCallback(() => {
    setLoading(true);
    getUserTransactions();
  }, [setLoading, getUserTransactions]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    loading,
    errorMessage: error?.message,
    transactions,
    showLoadMore: !!data?.user.transactions.hasNextPage,
    fetchTransactions,
  };
};

export { useUserTransactions };
