import config from 'config-dug';

import {
  BaseConsumer,
  Consumer,
  getSqsUrl,
  asyncLogger as logger,
  Sentry as sentry,
} from '@neofinancial/neo-framework';

import { inject } from '../../../lib/strict-inject';
import { ProviderTokens } from '../../../lib/provider-tokens';
import { TransactionProviderPort } from '../../../domain/providers/transactions/transaction.provider.port';
import { CreateTransaction } from '../../../domain/repositories/transaction.repository.port';
import { TransactionCategory, TransactionStatus } from '../../../domain/entities/transaction/transaction';
import { enumFromValueString } from '../../../lib/enum-helper';

export interface TransactionInitiatedMessageDTO {
  externalId: string;
  userId: string;
  amountCents: number;
  transactionDate: string;
  status: string;
  category: string;
}

const sqsUrl = getSqsUrl(config.SQS_TRANSACTION_INITIATED_TASK_QUEUE_NAME as string);

@Consumer
class TransactionInitiatedTaskConsumer extends BaseConsumer<TransactionInitiatedMessageDTO> {
  constructor(@inject(ProviderTokens.TransactionProvider) private transactionProvider: TransactionProviderPort) {
    super(sqsUrl, sentry, logger);
  }

  protected async handler(messageDTO: TransactionInitiatedMessageDTO): Promise<void> {
    const message = this.transformToDomain(messageDTO);

    await this.transactionProvider.createTransaction(message);
  }

  private transformToDomain(input: TransactionInitiatedMessageDTO): CreateTransaction {
    return {
      externalId: input.externalId,
      userId: input.userId,
      amountCents: input.amountCents,
      transactionDate: new Date(input.transactionDate),
      status: enumFromValueString(input.status, TransactionStatus),
      category: enumFromValueString(input.category, TransactionCategory),
    };
  }
}

export { TransactionInitiatedTaskConsumer };
