import { UserQueryFactory } from '../../../../test/factories/user-query.factory';
import {
  waitFor,
  renderHookWithProviders,
} from '../../../../test/lib/test-utils';
import { useUserDetails } from './use-user-details';
import {
  mockQuerySuccess,
  mockQueryError,
} from '../../../../test/lib/api-mock';
import { mapToUser } from '../api/use-user-details-query';

describe('useUserDetails', () => {
  const user = UserQueryFactory.build();

  const renderUseUserDetailsHook = () =>
    renderHookWithProviders(() => useUserDetails({ userId: user.id }));

  const mockUserQuerySuccess = () => {
    mockQuerySuccess(
      'User',
      {
        user,
      },
      {
        rawResult: true,
      },
    );
  };

  const mockUserQueryError = () => {
    mockQueryError('User');
  };

  test('should return the user if success', async () => {
    mockUserQuerySuccess();
    const { result } = renderUseUserDetailsHook();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toEqual(mapToUser(user));
  });

  test('should return the error message if error', async () => {
    mockUserQueryError();
    const { result } = renderUseUserDetailsHook();

    expect(result.current.errorMessage).not.toBeDefined();
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.errorMessage).toBeDefined();
  });
});
