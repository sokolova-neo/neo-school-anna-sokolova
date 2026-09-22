/* eslint-disable react/no-array-index-key */
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { formatCurrency, formatDate } from '../../lib/formatter';
import { ColumnType, type Column } from '../../types/table';

export interface TableRowsProps<T> {
  columns: Column<T>[];
  rows: T[];
}

export default function TableRows<T>({ rows, columns }: TableRowsProps<T>) {
  return (
    <>
      {rows.map((row, index) => (
        <TableRow key={`row-${index}`}>
          {columns.map((column) => (
            <TableCell key={`row-${index}-cell-${column.label}`}>
              {column.type === ColumnType.TEXT &&
                (row[column.key] as React.ReactNode)}
              {column.type === ColumnType.CENTS &&
                formatCurrency({
                  cents: row[column.key] as number,
                })}
              {column.type === ColumnType.DATE &&
                formatDate(row[column.key] as Date)}
              {column.type === ColumnType.NUMERIC &&
                (row[column.key] as React.ReactNode)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
