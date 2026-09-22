import { type Column, ColumnType } from '../../src/types/table';
import { type Transaction } from '../../src/types/transaction';

export const mockColumns: Column<Transaction>[] = [
  {
    key: 'transactionDate',
    label: 'Date',
    type: ColumnType.DATE,
  },
  {
    key: 'amountCents',
    label: 'Amount',
    type: ColumnType.CENTS,
  },
  {
    key: 'category',
    label: 'Category',
    type: ColumnType.TEXT,
  },
  {
    key: 'status',
    label: 'Status',
    type: ColumnType.TEXT,
  },
];
