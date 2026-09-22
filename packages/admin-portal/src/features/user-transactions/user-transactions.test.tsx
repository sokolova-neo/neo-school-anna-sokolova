import {
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
} from '../../../test/lib/test-utils';
import * as useUserTransactions from './providers/use-user-transactions';
import { UserTransactions } from './user-transactions';
import { TransactionFactory } from '../../../test/factories/transaction.factory';

jest.mock('./providers/use-user-transactions', () => ({
  __esModule: true,
  ...jest.requireActual('./providers/use-user-transactions'),
}));

describe('UserTransactions', () => {
  const transactions = TransactionFactory.buildList(5);
  const fetchTransactions = jest.fn();

  const defaultHookResults: useUserTransactions.UseUserTransactionsResult = {
    transactions,
    loading: false,
    showLoadMore: true,
    fetchTransactions,
  };

  const renderUserTransactions = (
    hookResults?: Partial<useUserTransactions.UseUserTransactionsResult>,
  ) => {
    jest.spyOn(useUserTransactions, 'useUserTransactions').mockReturnValue({
      ...defaultHookResults,
      ...hookResults,
    });

    renderWithProviders(<UserTransactions userId="1" />);

    return {
      $getText: (text: string) => screen.getByText(text),
      $getLoading: () => screen.getByRole('progressbar'),
      $getLoadMoreButton: () =>
        screen.getByRole('button', { name: /load more transactions/i }),
    };
  };

  test('should render loading when loading', () => {
    const { $getLoading } = renderUserTransactions({ loading: true });

    expect($getLoading()).toBeVisible();
  });

  test('should render error when error', () => {
    const errorMessage = 'Error message';
    const { $getText } = renderUserTransactions({ errorMessage });

    expect($getText(errorMessage)).toBeVisible();
  });

  test('should render load more button when not reached the end of the transactions', () => {
    const { $getLoadMoreButton } = renderUserTransactions({
      showLoadMore: true,
    });

    expect($getLoadMoreButton()).toBeVisible();
  });

  test('should call fetchTransactions when clicked on load more button', async () => {
    const { $getLoadMoreButton } = renderUserTransactions({
      showLoadMore: true,
    });

    userEvent.click($getLoadMoreButton());

    await waitFor(() => expect(fetchTransactions).toHaveBeenCalledTimes(1));
  });
});
