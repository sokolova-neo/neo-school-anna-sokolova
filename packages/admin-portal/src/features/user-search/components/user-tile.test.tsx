import { UserFactory } from '../../../../test/factories/user.factory';
import { renderWithProviders, screen } from '../../../../test/lib/test-utils';
import * as UseUserLinks from '../../../hooks/use-user-links';
import { UserTile } from './user-tile';

jest.mock('../../../hooks/use-user-links', () => ({
  __esModule: true,
  ...jest.requireActual('../../../hooks/use-user-links'),
}));

describe('UserTile', () => {
  const user = UserFactory.build();

  const defaultProps = {
    name: user.firstName,
    email: user.email,
    phone: user.phone,
    id: user.id,
  };

  const defaultHookResults: UseUserLinks.UseUserLinks = {
    overviewLink: `/users/${user.id}/details`,
    transactionsLink: `/users/${user.id}/transactions`,
  };

  const renderUserTile = (
    props = defaultProps,
    hookResults?: Partial<UseUserLinks.UseUserLinks>,
  ) => {
    jest.spyOn(UseUserLinks, 'useUserLinks').mockReturnValue({
      ...defaultHookResults,
      ...hookResults,
    });

    renderWithProviders(<UserTile {...props} />);

    return {
      $getText: (text: string) => screen.getByText(text),
      $getLink: (name: string) => screen.getByRole('link', { name }),
    };
  };

  test('should render name', async () => {
    const { $getText } = renderUserTile();

    expect($getText(defaultProps.name)).toBeVisible();
  });

  test('should render email', async () => {
    const { $getText } = renderUserTile();

    expect($getText(defaultProps.email)).toBeVisible();
  });

  test('should render phone', async () => {
    const { $getText } = renderUserTile();

    expect($getText(defaultProps.phone)).toBeVisible();
  });

  test('should render transaction link', async () => {
    const { $getLink } = renderUserTile();

    expect($getLink('Transactions')).toHaveAttribute(
      'href',
      defaultHookResults.transactionsLink,
    );
  });

  test('should render overview link', async () => {
    const { $getLink } = renderUserTile();

    expect($getLink('Overview')).toHaveAttribute(
      'href',
      defaultHookResults.overviewLink,
    );
  });
});
