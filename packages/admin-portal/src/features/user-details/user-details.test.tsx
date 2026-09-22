import {
  renderWithProviders,
  screen,
  waitFor,
} from '../../../test/lib/test-utils';
import { UserDetails } from './user-details';
import { UserQueryFactory } from '../../../test/factories/user-query.factory';

import { mockQuerySuccess } from '../../../test/lib/api-mock';

describe('UserDetails', () => {
  const user = UserQueryFactory.build();

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

  const renderUserDetails = () => {
    renderWithProviders(<UserDetails userId="1" />);

    return {
      $getAccountStatusLabel: () => screen.getByText('Account Status:'),
      $getAccountStatus: () => screen.getByText(user.status),
      $getFirstName: () => screen.getByText(user.firstName),
      $getPersonalDataLabel: () => screen.getByText('Personal Data'),
    };
  };

  test('should render Account Status', async () => {
    mockUserQuerySuccess();
    const { $getAccountStatus } = renderUserDetails();

    await waitFor(() => {
      expect($getAccountStatus()).toBeVisible();
    });
  });

  test('should render Account Status Label', async () => {
    mockUserQuerySuccess();
    const { $getAccountStatusLabel } = renderUserDetails();

    await waitFor(() => {
      expect($getAccountStatusLabel()).toBeVisible();
    });
  });

  test('should render personal data', async () => {
    mockUserQuerySuccess();
    const { $getPersonalDataLabel } = renderUserDetails();

    await waitFor(() => {
      expect($getPersonalDataLabel()).toBeVisible();
    });
  });

  test('should render first name', async () => {
    mockUserQuerySuccess();
    const { $getFirstName } = renderUserDetails();

    await waitFor(() => {
      expect($getFirstName()).toBeVisible();
    });
  });
});
