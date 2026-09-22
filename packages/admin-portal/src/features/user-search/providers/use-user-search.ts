import { type SelectChangeEvent } from '@mui/material';
import { type ChangeEvent, useState, useEffect } from 'react';
import { usePagination } from '../../../hooks/use-pagination';
import { type User } from '../../../types/user';
import {
  RelativeCursorQuerySortDirection,
  RelativeCursorQueryValueType,
  useRelativeCursorQuery,
} from '../../../hooks/use-relative-cursor-query';
import {
  mapToQueryInput,
  mapToUser,
  useUsersQuery,
} from '../api/use-users-query';
import { formatName } from '../../../lib/formatter';

export interface UseUserSearchResult {
  loading: boolean;
  users: User[];
  errorMessage?: string;
  onSearchChanged: (e: { target: { value: string } }) => void;
  onPaginationChanged: (e: ChangeEvent<unknown>, page: number) => void;
  onRowsPerPageChanged: (e: SelectChangeEvent<unknown>) => void;
  pageSize: number;
  searchTerm: string;
  totalUsers: number;
  page: number;
}

const useUserSearch = (): UseUserSearchResult => {
  const initialQueryValue = {
    filter: [],
    limit: 100,
    primaryCursor: {
      sort: RelativeCursorQuerySortDirection.ASC,
      field: '_id',
      type: RelativeCursorQueryValueType.OBJECT_ID,
    },
  };
  const { relativeCursorQuery } = useRelativeCursorQuery(initialQueryValue);
  const { error, loading, data } = useUsersQuery({
    variables: {
      input: mapToQueryInput(relativeCursorQuery),
    },
  });
  const { setPage, pageSize, page, setPageSize, paginationFilter } =
    usePagination<User>({
      defaultPageSize: 5,
    });
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);

  const onSearchChanged = (e: { target: { value: string } }) => {
    setPage(1);
    setSearchTerm(e.target.value);
  };
  const onPaginationChanged = (e: ChangeEvent<unknown>, newPage: number) =>
    setPage(newPage);
  const onRowsPerPageChanged = (e: SelectChangeEvent<unknown>) =>
    setPageSize(Number(e.target.value));

  useEffect(() => {
    const filteredUsers = (data?.users?.results ?? [])
      .map(mapToUser)
      .filter((user) =>
        formatName(user)
          .trim()
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase()),
      );
    setUsers(filteredUsers);
  }, [data?.users?.results, searchTerm]);

  return {
    loading,
    users: users.filter(paginationFilter),
    errorMessage: error?.message,
    onSearchChanged,
    onPaginationChanged,
    onRowsPerPageChanged,
    pageSize,
    searchTerm,
    totalUsers: users.length,
    page,
  };
};

export { useUserSearch };
