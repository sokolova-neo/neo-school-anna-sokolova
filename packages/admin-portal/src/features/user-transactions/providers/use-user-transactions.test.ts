import { UserTransactionsQueryFactory } from '../../../../test/factories/user-transactions-query.factory';
import {
  waitFor,
  renderHookWithProviders,
  act,
} from '../../../../test/lib/test-utils';
import { useUserTransactions } from './use-user-transactions';
import { mockQuerySuccess } from '../../../../test/lib/api-mock';
import { mapToTransaction } from '../api/use-user-transactions-query';
import type { UserTransactionsQuery } from '../api/__graphql/use-user-transactions-query.generated.d';

describe('useUserTransactions', () => {
  const renderUseUserTransactionsHook = () =>
    renderHookWithProviders(() => useUserTransactions({ userId: '1' }));

  const mockUserTransactionsSuccess = (
    userTransactions: UserTransactionsQuery['user']['transactions'],
  ) => {
    mockQuerySuccess(
      'UserTransactions',
      {
        user: {
          transactions: userTransactions,
        },
      },
      {
        rawResult: true,
      },
    );
  };

  test('should return the user transactions', async () => {
    const userTransactions = UserTransactionsQueryFactory.build();
    mockUserTransactionsSuccess(userTransactions);
    const { result } = renderUseUserTransactionsHook();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.transactions).toEqual(
      userTransactions.results.map(mapToTransaction),
    );
  });

  test('should return more transactions if there are more available', async () => {
    const userTransactionsWithNextPage = UserTransactionsQueryFactory.build({
      hasNextPage: true,
    });
    const moreUserTransactions = UserTransactionsQueryFactory.build();

    const { result } = renderUseUserTransactionsHook();

    mockUserTransactionsSuccess(userTransactionsWithNextPage);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.showLoadMore).toBe(true);

    mockUserTransactionsSuccess(moreUserTransactions);

    act(() => {
      result.current.fetchTransactions();
    });

    await waitFor(() =>
      expect(result.current.transactions).toEqual(
        [
          ...userTransactionsWithNextPage.results,
          ...moreUserTransactions.results,
        ].map(mapToTransaction),
      ),
    );
  });
});
