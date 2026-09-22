'use client';

import {
  Spinner,
  Typography,
  Box,
  Button,
  Grid,
} from '@neofinancial/morpheus-components';
import Table from '../../components/table/table';
import { type Column, ColumnType, Order } from '../../types/table';
import { useUserTransactions } from './providers/use-user-transactions';
import { type Transaction } from '../../types/transaction';

const UserTransactions = ({
  userId,
}: {
  userId: string;
}): React.ReactElement => {
  const {
    loading,
    errorMessage,
    transactions,
    showLoadMore,
    fetchTransactions,
  } = useUserTransactions({
    userId,
  });

  if (loading) {
    return <Spinner />;
  }

  if (errorMessage) {
    return <Typography variant="headingM">{errorMessage}</Typography>;
  }

  const columns: Column<Transaction>[] = [
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
  return (
    <Box margin="spaceL">
      <Typography variant="headingS">Credit Account Transactions</Typography>
      <Box padding="spaceM" marginTop="spaceM">
        <Grid container display="flex" alignItems="flex-start">
          <Grid item xs={11}>
            <Table<Transaction>
              rows={transactions}
              columns={columns}
              defaultOrderBy="transactionDate"
              defaultOrder={Order.DESC}
              emptyState="Customer has no transactions"
            />
          </Grid>
          {showLoadMore && (
            <Grid item container marginTop={50} xs={11}>
              <Button
                variant="primary"
                size="small"
                width="padded"
                onClick={fetchTransactions}
              >
                Load more transactions
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export { UserTransactions };
