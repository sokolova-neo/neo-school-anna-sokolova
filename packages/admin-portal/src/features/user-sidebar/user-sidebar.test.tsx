import { renderWithProviders, screen } from '../../../test/lib/test-utils';
import { UserSidebar } from './user-sidebar';

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname() {
    return 'user/1/details';
  },
  useSearchParams: () => ({
    get: () => {},
  }),
  useServerInsertedHTML: jest.fn(),
}));

describe('UserSidebar', () => {
  const renderUserSidebar = () => {
    renderWithProviders(<UserSidebar userId="1" />);

    return {
      $getCustomerDetails: () => screen.getByText('Customer details'),
      $getTransactions: () => screen.getByText('Transactions'),
    };
  };

  test('should render customer details', () => {
    const { $getCustomerDetails } = renderUserSidebar();

    expect($getCustomerDetails()).toBeVisible();
  });

  test('should render transactions', () => {
    const { $getTransactions } = renderUserSidebar();

    expect($getTransactions()).toBeVisible();
  });
});
