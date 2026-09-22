import { type Transaction } from '../../types/transaction';
import {
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
} from '../../../test/lib/test-utils';
import { Order } from '../../types/table';
import Table from './table';
import { TransactionFactory } from '../../../test/factories/transaction.factory';
import { formatCurrency } from '../../lib/formatter';
import { mockColumns } from '../../../test/mocks/table';

describe('Table', () => {
  const rows = TransactionFactory.buildList(30);

  const defaultProps = {
    columns: mockColumns,
    rows,
    defaultOrderBy: mockColumns[0].key,
    defaultOrder: Order.ASC,
    emptyState: 'No data for this table',
  };

  const renderTable = (props = defaultProps) => {
    renderWithProviders(<Table<Transaction> {...props} />);

    return {
      $queryText: (text: string) => screen.queryByText(text),
      $getAmountColumn: () => screen.getByRole('button', { name: /amount/i }),
      $getAllRows: () => screen.getAllByRole('row'),
    };
  };

  test('should render the empty state if rows are empty', () => {
    const { $queryText } = renderTable({ ...defaultProps, rows: [] });

    expect($queryText(defaultProps.emptyState)).toBeVisible();
  });

  test('should not render the empty state if rows are not empty', () => {
    const { $queryText } = renderTable();

    expect($queryText(defaultProps.emptyState)).toEqual(null);
  });

  test('should update the sorting of the rows when clicked on column', async () => {
    const { $getAmountColumn, $getAllRows } = renderTable();
    const minAmount = Math.min(...rows.map((row) => row.amountCents));
    const maxAmount = Math.max(...rows.map((row) => row.amountCents));

    userEvent.click($getAmountColumn());

    const renderedRows = $getAllRows();

    await waitFor(() => {
      expect(renderedRows[1].textContent).toContain(
        formatCurrency({ cents: minAmount }),
      );
      expect(renderedRows[renderedRows.length - 1].textContent).toContain(
        formatCurrency({ cents: maxAmount }),
      );
    });
  });
});
