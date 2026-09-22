import { useUserSearch } from './use-user-search';
import {
  act,
  renderHookWithProviders,
  waitFor,
} from '../../../../test/lib/test-utils';
import { UserFactory } from '../../../../test/factories/user.factory';
import {
  mockQueryError,
  mockQuerySuccess,
} from '../../../../test/lib/api-mock';
import { formatName } from '../../../lib/formatter';

describe('useUserSearch', () => {
  const users = UserFactory.buildList(100);
  const pageSize = 5;
  const searchTerm = '';
  const totalUsers = 100;
  const page = 1;

  const renderUseUserSearchHook = () => renderHookWithProviders(useUserSearch);

  const mockUsersQuerySuccessOnce = () => {
    mockQuerySuccess(
      'Users',
      {
        users: {
          results: users,
          hasNextPage: false,
          primaryCursor: {
            cursor: '',
          },
          secondaryCursor: {
            cursor: '',
          },
        },
      },
      {
        rawResult: true,
      },
    );
  };

  describe('loading', () => {
    test('should initially be true', () => {
      mockUsersQuerySuccessOnce();
      const { result } = renderUseUserSearchHook();

      expect(result.current.loading).toBe(true);
    });

    test('should be falsy after query call', async () => {
      mockUsersQuerySuccessOnce();
      const { result } = renderUseUserSearchHook();

      await waitFor(() => expect(result.current.loading).toBe(false));
    });
  });

  describe('users', () => {
    test('should return the paginated list of users', async () => {
      mockUsersQuerySuccessOnce();

      const { result } = renderUseUserSearchHook();

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.pageSize).toEqual(pageSize);
      expect(result.current.searchTerm).toEqual(searchTerm);
      expect(result.current.totalUsers).toEqual(totalUsers);
      expect(result.current.page).toEqual(page);
      expect(result.current.users).toEqual(users.slice(0, pageSize));
    });
  });

  describe('error', () => {
    test('should be undefined when query is successful', async () => {
      mockUsersQuerySuccessOnce();

      const { result } = renderUseUserSearchHook();

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.errorMessage).toBeUndefined();
    });

    test('should return an error message when query is unsuccessful', async () => {
      const errorMessage = 'this is an error';
      mockQueryError('Users', [{ message: errorMessage }]);

      const { result } = renderUseUserSearchHook();

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.errorMessage).toBe(errorMessage);
    });
  });

  describe('onSearchChanged', () => {
    test('should set the searchTerm and filter the users', async () => {
      const newSearchTerm = 'ca';

      mockUsersQuerySuccessOnce();

      const { result } = renderUseUserSearchHook();

      await waitFor(() => expect(result.current.loading).toBe(false));

      act(() => {
        result.current.onSearchChanged({ target: { value: newSearchTerm } });
      });

      const filteredUsers = users.filter((user) =>
        formatName(user)
          .trim()
          .toLowerCase()
          .includes(newSearchTerm.trim().toLowerCase()),
      );
      expect(result.current.users).toEqual(filteredUsers.slice(0, pageSize));
      expect(result.current.searchTerm).toEqual(newSearchTerm);
    });
  });
});
