import { RelativeCursorInput, RelativeCursorResultList } from '@neofinancial/neo-framework';

import { Transaction } from '../../entities/transaction/transaction';
import { CreateTransaction } from '../../repositories/transaction.repository.port';

export interface TransactionProviderPort {
  getTransactions(input: RelativeCursorInput): Promise<RelativeCursorResultList<Transaction>>;
  createTransaction(input: CreateTransaction): Promise<Transaction>;
}
