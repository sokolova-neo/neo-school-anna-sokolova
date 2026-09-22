import { renderWithProviders, screen } from '../../../test/lib/test-utils';
import TableEmptyState, {
  type TableEmptyStateProps,
} from './table-empty-state';

describe('TableEmptyState', () => {
  const renderTableEmptyState = (props?: TableEmptyStateProps) => {
    renderWithProviders(<TableEmptyState {...props} />);

    return {
      $getText: (text: string) => screen.getByText(text),
    };
  };

  test('should render the default empty state text', () => {
    const { $getText } = renderTableEmptyState();

    expect($getText('No data')).toBeVisible();
  });

  test('should render a custom empty state text', () => {
    const emptyState = 'Oops! Nothing for you!';
    const { $getText } = renderTableEmptyState({ emptyState });

    expect($getText(emptyState)).toBeVisible();
  });
});
