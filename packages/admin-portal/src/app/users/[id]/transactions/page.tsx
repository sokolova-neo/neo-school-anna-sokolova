'use client';

import { UserTransactions } from '../../../../features/user-transactions/user-transactions';

export default function TransactionsPage({
  params,
}: {
  params: { id: string };
}) {
  return <UserTransactions userId={params.id ?? ''} />;
}
