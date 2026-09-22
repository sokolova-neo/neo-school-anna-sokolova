import { BaseProducerTask } from '@neofinancial/neo-framework';

import { TransactionCategory, TransactionStatus } from '../../entities/transaction/transaction';

export interface TransactionInitiatedDTO {
  externalId: string;
  userId: string;
  amountCents: number;
  transactionDate: Date;
  status: TransactionStatus;
  category: TransactionCategory;
}

export interface TransactionInitiatedTaskProducerPort extends BaseProducerTask<TransactionInitiatedDTO> {}
