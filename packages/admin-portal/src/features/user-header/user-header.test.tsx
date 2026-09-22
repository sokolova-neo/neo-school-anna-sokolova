import { renderWithProviders, screen } from '../../../test/lib/test-utils';
import * as useUserHeader from './providers/use-user-header';
import { UserHeader } from './user-header';
import { UserFactory } from '../../../test/factories/user.factory';

jest.mock('./providers/use-user-header', () => ({
  __esModule: true,
  ...jest.requireActual('./providers/use-user-header'),
}));

describe('UserHeader', () => {
  const user = UserFactory.build();
  const defaultTimeZoneText =
    'Customer timezone could not be determined - Dates will be displayed in UTC';
  const testDisplayName = `${user.firstName} ${user.lastName}`;

  const defaultHookResults: useUserHeader.UseUserHeaderResult = {
    onExit: jest.fn(),
    timeZoneText: defaultTimeZoneText,
    displayName: testDisplayName,
    loading: false,
  };

  const renderUserHeader = (
    hookResults?: Partial<useUserHeader.UseUserHeaderResult>,
  ) => {
    jest.spyOn(useUserHeader, 'useUserHeader').mockReturnValue({
      ...defaultHookResults,
      ...hookResults,
    });

    renderWithProviders(<UserHeader userId="1" />);

    return {
      $getDisplayName: () => screen.getByText(testDisplayName),
      $getTimeZone: () => screen.getByText(defaultTimeZoneText),
    };
  };

  test('should render user name', () => {
    const { $getDisplayName } = renderUserHeader();

    expect($getDisplayName()).toBeVisible();
  });

  test('should render timezone string', () => {
    const { $getTimeZone } = renderUserHeader();

    expect($getTimeZone()).toBeVisible();
  });
});
