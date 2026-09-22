import React from 'react';
import Box from '@mui/material/Box';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { type Column, Order } from '../../types/table';
import { getComparator } from '../../lib/comparator';
import TableHead from './table-head';
import TableEmptyState from './table-empty-state';
import TableRows from './table-rows';

interface TableProps<T> {
  rows: T[];
  columns: Column<T>[];
  defaultOrderBy?: keyof T;
  defaultOrder?: Order;
  emptyState?: string;
}

export default function Table<T>({
  rows,
  columns,
  defaultOrderBy,
  defaultOrder,
  emptyState,
}: TableProps<T>) {
  const [order, setOrder] = React.useState<Order>(defaultOrder ?? Order.ASC);
  const [orderBy, setOrderBy] = React.useState<keyof T>(
    defaultOrderBy ?? columns[0].key,
  );

  const handleRequestSort = (
    _: React.MouseEvent<unknown>,
    property: keyof T,
  ) => {
    const isAsc = orderBy === property && order === Order.ASC;
    setOrder(isAsc ? Order.DESC : Order.ASC);
    setOrderBy(property);
  };

  const orderedRows = React.useMemo<T[]>(
    () => [...rows].sort(getComparator<T>(order, orderBy)),
    [order, orderBy, rows],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer>
        <MuiTable
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size="medium"
        >
          <TableHead<T>
            columns={columns}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            <TableRows<T> rows={orderedRows} columns={columns} />
          </TableBody>
        </MuiTable>
      </TableContainer>
      {rows.length === 0 && <TableEmptyState emptyState={emptyState} />}
    </Box>
  );
}
