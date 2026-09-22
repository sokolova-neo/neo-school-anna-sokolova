import * as useRouter from 'next/navigation';
import NotFound from './not-found';
import {
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
} from '../../test/lib/test-utils';

jest.mock('next/navigation', () => ({
  __esModule: true,
  ...jest.requireActual('next/navigation'),
}));

describe('NotFoundPage', () => {
  const backMock = jest.fn();
  jest.spyOn(useRouter, 'useRouter').mockReturnValue({
    push: jest.fn(),
    back: backMock,
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  });

  const renderNotFound = () => {
    renderWithProviders(<NotFound />);

    return {
      $getText: (text: string) => screen.getByText(text),
      $getGoBackButton: () => screen.getByRole('button', { name: 'Go Back' }),
    };
  };

  test('should render the oopsie message', () => {
    const { $getText } = renderNotFound();

    expect(
      $getText('Oh no! The page you are looking for does not exist!'),
    ).toBeVisible();
  });

  test('should go back when clickin on button', async () => {
    const { $getGoBackButton } = renderNotFound();

    userEvent.click($getGoBackButton());

    await waitFor(() => expect(backMock).toHaveBeenCalledTimes(1));
  });
});
