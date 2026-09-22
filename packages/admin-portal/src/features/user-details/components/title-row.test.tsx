import {
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
} from '../../../../test/lib/test-utils';
import { TitleRow } from './title-row';

describe('TitleRow', () => {
  const action = jest.fn();

  const defaultProps = {
    label: 'title',
    action,
  };

  const renderTitleRow = (props = defaultProps) => {
    renderWithProviders(<TitleRow {...props} />);

    return {
      $getByText: (text: string) => screen.getByText(text),
      $getButton: () => screen.getByRole('button'),
    };
  };

  test('should render title', () => {
    const { $getByText } = renderTitleRow();

    expect($getByText(defaultProps.label)).toBeVisible();
  });

  test('should render call action when icon is clicked', async () => {
    const { $getButton } = renderTitleRow();

    userEvent.click($getButton());

    await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
  });
});
