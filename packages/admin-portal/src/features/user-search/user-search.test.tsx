import { UserFactory } from '../../../test/factories/user.factory';
import {
  fireEvent,
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../test/lib/test-utils';
import * as UseUserSearch from './providers/use-user-search';
import { UserSearch } from './user-search';

jest.mock('./providers/use-user-search', () => ({
  __esModule: true,
  ...jest.requireActual('./providers/use-user-search'),
}));

describe('UserSearch', () => {
  const users = UserFactory.buildList(15);
  const onSearchChanged = jest.fn();
  const onPaginationChanged = jest.fn();
  const onRowsPerPageChanged = jest.fn();

  const defaultHookResults: UseUserSearch.UseUserSearchResult = {
    loading: false,
    users,
    onSearchChanged,
    onPaginationChanged,
    onRowsPerPageChanged,
    pageSize: 5,
    searchTerm: '',
    totalUsers: 100,
    page: 1,
  };

  const renderUserSearch = (
    hookResults?: Partial<UseUserSearch.UseUserSearchResult>,
  ) => {
    jest.spyOn(UseUserSearch, 'useUserSearch').mockReturnValue({
      ...defaultHookResults,
      ...hookResults,
    });

    renderWithProviders(<UserSearch />);

    return {
      $getText: (text: string) => screen.getByText(text),
      $getLoading: () => screen.getByRole('progressbar'),
      $getSelect: () => screen.getByRole('combobox'),
      $getByRole: (role: string) => screen.getByRole(role),
      $findOptionList: () => screen.findByRole('listbox'),
      $getSearchInput: () => screen.getByPlaceholderText('Search'),
      $getPaginationButton: () =>
        screen.getByRole('button', { name: /go to page 3/i }),
    };
  };

  test('should render loading when loading', async () => {
    const { $getLoading } = renderUserSearch({ loading: true });

    expect($getLoading()).toBeVisible();
  });

  test('should render error when error', async () => {
    const errorMessage = 'Error message';
    const { $getText } = renderUserSearch({ errorMessage });

    expect($getText(errorMessage)).toBeVisible();
  });

  test('should render the list of users', async () => {
    const { $getText } = renderUserSearch();

    users.forEach((user) => {
      expect($getText(user.email)).toBeVisible();
    });
  });

  test('should call onRowsPerPageChanged when changing the select', async () => {
    const { $getSelect, $findOptionList } = renderUserSearch();

    fireEvent.mouseDown($getSelect());
    const optionsList = await $findOptionList();
    const options = within(optionsList).getAllByRole('option');
    const optionValues = options.map((option) => option.textContent);
    expect(optionValues).toEqual(['5', '10', '20']);

    userEvent.click(options[1]);

    await waitFor(() =>
      expect(defaultHookResults.onRowsPerPageChanged).toHaveBeenCalledTimes(1),
    );
  });

  test('should call onSearchChanged when adding a search term', async () => {
    const searchTerm = 'my search';
    const { $getSearchInput } = renderUserSearch();

    userEvent.type($getSearchInput(), searchTerm);

    await waitFor(() =>
      expect(defaultHookResults.onSearchChanged).toHaveBeenCalledTimes(1),
    );
  });

  test('should call onPaginationChanged when clicking on pagination', async () => {
    const { $getPaginationButton } = renderUserSearch();

    userEvent.click($getPaginationButton());

    await waitFor(() =>
      expect(defaultHookResults.onPaginationChanged).toHaveBeenCalledTimes(1),
    );
  });
});
