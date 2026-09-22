import { useState } from 'react';

export interface UsePagination<T> {
  page: number;
  pageSize: number;
  pageCursor: number;
  setPageSize: (newPageSize: number) => void;
  setPage: (newPage: number) => void;
  paginationFilter: (value: T, index: number, array: T[]) => boolean;
}

const usePagination = <T>({
  defaultPageSize,
}: {
  defaultPageSize?: number;
}): UsePagination<T> => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize ?? 5);
  const [pageCursor, setPageCursor] = useState(0);

  const updatePageSize = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
    setPageCursor(0);
  };

  const updatePage = (newPage: number) => {
    setPageCursor((newPage - 1) * pageSize);
    setPage(newPage);
  };

  const paginationFilter = (_: T, index: number) =>
    index >= pageCursor && index < pageCursor + pageSize;

  return {
    page,
    pageCursor,
    setPage: updatePage,
    pageSize,
    setPageSize: updatePageSize,
    paginationFilter,
  };
};

export { usePagination };
