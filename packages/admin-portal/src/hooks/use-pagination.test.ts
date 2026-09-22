import { UserFactory } from '../../test/factories/user.factory';
import { act, renderHookWithProviders } from '../../test/lib/test-utils';
import { usePagination } from './use-pagination';
import { type User } from '../types/user';

describe('usePagination', () => {
  const defaultPageSize = 15;

  const renderUsePagination = <T>() =>
    renderHookWithProviders(() => usePagination<T>({ defaultPageSize }));

  test('should start with page at the beginning of the pagination', () => {
    const { page, pageSize, pageCursor } = renderUsePagination().result.current;

    expect(page).toEqual(1);
    expect(pageSize).toEqual(defaultPageSize);
    expect(pageCursor).toEqual(0);
  });

  test('should update the cursor when the page is updated', () => {
    const { result } = renderUsePagination();
    const newPage = 10;

    act(() => {
      result.current.setPage(newPage);
    });

    expect(result.current.page).toEqual(newPage);
    expect(result.current.pageCursor).toEqual(
      (newPage - 1) * result.current.pageSize,
    );
  });

  test('should reset the page and cursor when the page size is updated', () => {
    const { result } = renderUsePagination();
    const newPageSize = 20;

    act(() => {
      result.current.setPageSize(newPageSize);
    });

    expect(result.current.page).toEqual(1);
    expect(result.current.pageCursor).toEqual(0);
    expect(result.current.pageSize).toEqual(newPageSize);
  });

  test('should filter an array using the cursor and page size', () => {
    const users = UserFactory.buildList(50);
    let filteredUsers: User[] = [];

    const { result } = renderUsePagination<User>();

    act(() => {
      filteredUsers = users.filter(result.current.paginationFilter);
    });

    expect(filteredUsers).toEqual(users.slice(0, defaultPageSize));
  });
});
