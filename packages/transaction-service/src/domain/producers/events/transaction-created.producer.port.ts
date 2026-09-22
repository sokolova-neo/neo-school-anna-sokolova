import { BaseProducer } from '@neofinancial/neo-framework';

import { TransactionCategory, TransactionStatus } from '../../entities/transaction/transaction';

export interface TransactionCreatedDTO {
  id: string;
  externalId: string;
  userId: string;
  amountCents: number;
  transactionDate: Date;
  status: TransactionStatus;
  category: TransactionCategory;
}

type TransactionCreatedProducerPort = BaseProducer<TransactionCreatedDTO>;

export { TransactionCreatedProducerPort };
