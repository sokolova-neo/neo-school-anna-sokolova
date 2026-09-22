import Table from '@mui/material/Table';
import { type Transaction } from '../../types/transaction';
import {
  renderWithProviders,
  screen,
  userEvent,
  waitFor,
} from '../../../test/lib/test-utils';
import { Order } from '../../types/table';
import TableHead from './table-head';
import { mockColumns } from '../../../test/mocks/table';

describe('TableHead', () => {
  const onRequestSort = jest.fn();

  const defaultProps = {
    columns: mockColumns,
    onRequestSort,
    order: Order.ASC,
    orderBy: mockColumns[1].key,
  };

  const renderTableHead = (props = defaultProps) => {
    renderWithProviders(
      <Table>
        <TableHead<Transaction> {...props} />
      </Table>,
    );

    return {
      $getButton: (name: string) => screen.getByRole('button', { name }),
    };
  };

  test("should render the columns' labels", () => {
    const { $getButton } = renderTableHead();

    mockColumns.forEach((column) => {
      expect($getButton(column.label)).toBeVisible();
    });
  });

  test('should call onRequestSort when column is clicked', async () => {
    const { $getButton } = renderTableHead();

    userEvent.click($getButton(mockColumns[3].label));

    await waitFor(() => expect(onRequestSort).toHaveBeenCalledTimes(1));
  });
});
