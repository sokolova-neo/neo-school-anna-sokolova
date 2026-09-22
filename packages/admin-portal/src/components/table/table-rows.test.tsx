import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { type Transaction } from '../../types/transaction';
import { renderWithProviders, screen } from '../../../test/lib/test-utils';
import { ColumnType } from '../../types/table';
import TableRows from './table-rows';
import { TransactionFactory } from '../../../test/factories/transaction.factory';
import { formatCurrency, formatDate } from '../../lib/formatter';
import { mockColumns } from '../../../test/mocks/table';

describe('TableRows', () => {
  const rows = TransactionFactory.buildList(10);
  const defaultProps = {
    columns: mockColumns,
    rows,
  };

  const renderTableRows = (props = defaultProps) => {
    renderWithProviders(
      <Table>
        <TableBody>
          <TableRows<Transaction> {...props} />
        </TableBody>
      </Table>,
    );

    return {
      $getAllCells: (name: string) => screen.getAllByRole('cell', { name }),
      $getAllRows: () => screen.getAllByRole('row'),
    };
  };

  test('should render all rows', () => {
    const { $getAllRows } = renderTableRows();

    expect($getAllRows().length).toEqual(defaultProps.rows.length);
  });

  test('should render the rows based on column type - TEXT', () => {
    const { $getAllCells } = renderTableRows();

    rows.forEach((row) => {
      mockColumns.forEach((column) => {
        if (column.type === ColumnType.TEXT) {
          expect($getAllCells(row[column.key] as string)[0]).toBeVisible();
        }
      });
    });
  });
  test('should render the rows based on column type - NUMERIC', () => {
    const { $getAllCells } = renderTableRows();

    rows.forEach((row) => {
      mockColumns.forEach((column) => {
        if (column.type === ColumnType.NUMERIC) {
          expect($getAllCells(row[column.key] as string)[0]).toBeVisible();
        }
      });
    });
  });
  test('should render the rows based on column type - DATE', () => {
    const { $getAllCells } = renderTableRows();

    rows.forEach((row) => {
      mockColumns.forEach((column) => {
        if (column.type === ColumnType.DATE) {
          expect(
            $getAllCells(formatDate(row[column.key] as Date))[0],
          ).toBeVisible();
        }
      });
    });
  });
  test('should render the rows based on column type - CENTS', () => {
    const { $getAllCells } = renderTableRows();

    rows.forEach((row) => {
      mockColumns.forEach((column) => {
        if (column.type === ColumnType.CENTS) {
          expect(
            $getAllCells(
              formatCurrency({ cents: row[column.key] as number }),
            )[0],
          ).toBeVisible();
        }
      });
    });
  });
});
