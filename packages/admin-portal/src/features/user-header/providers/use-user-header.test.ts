import * as useRouter from 'next/navigation';

import { UserQueryFactory } from '../../../../test/factories/user-query.factory';
import {
  waitFor,
  renderHookWithProviders,
} from '../../../../test/lib/test-utils';
import { useUserHeader } from './use-user-header';
import { getTimezoneOffsetByProvince } from '../../../lib/timezone';
import { formatName } from '../../../lib/formatter';

import { mockQuerySuccess } from '../../../../test/lib/api-mock';

jest.mock('next/navigation', () => ({
  __esModule: true,
  ...jest.requireActual('next/navigation'),
}));

describe('useUserHeader', () => {
  const user = UserQueryFactory.build();

  const timezoneString = (timezoneOffset: string) =>
    `Dates will be displayed in ${timezoneOffset}`;

  const displayNameTest = formatName({
    firstName: user.firstName,
    lastName: user.lastName,
    preferredName: user.preferredName || undefined,
  });

  const renderUseUserHeaderHook = () =>
    renderHookWithProviders(() => useUserHeader({ userId: '1' }));

  const pushMock = jest.fn();
  jest.spyOn(useRouter, 'useRouter').mockReturnValue({
    push: pushMock,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  });

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

  test('should return correct displayName string', async () => {
    mockUserQuerySuccess();
    const { result } = renderUseUserHeaderHook();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.displayName).toBe(displayNameTest);
  });

  test('should return correct timeZoneText string', async () => {
    mockUserQuerySuccess();
    const { result } = renderUseUserHeaderHook();
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.timeZoneText).toBe(
      timezoneString(getTimezoneOffsetByProvince(user.province)),
    );
  });

  test('should return onClick handler that routes to /', async () => {
    mockUserQuerySuccess();
    const { result } = renderUseUserHeaderHook();
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.onExit();

    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
