import { RepositoryHook } from '@neofinancial/neo-framework';

import { Transaction } from '../../../domain/entities/transaction/transaction';
import { TransactionCreatedProducerPort } from '../../../domain/producers/events/transaction-created.producer.port';

import { TransactionRepositoryHookPort } from '../../../domain/repositories/transaction.repository.hook.port';
import { ProducerTokens } from '../../../lib/producer-tokens';
import { inject } from '../../../lib/strict-inject';

@RepositoryHook
class TransactionRepositoryHookAdapter implements TransactionRepositoryHookPort {
  constructor(
    @inject(ProducerTokens.TransactionCreatedProducer)
    private transactionCreatedProducer: TransactionCreatedProducerPort,
  ) {}

  public async onCreate(input: Transaction): Promise<void> {
    await this.transactionCreatedProducer.send({
      id: input.id,
      externalId: input.externalId,
      userId: input.userId,
      amountCents: input.amountCents,
      category: input.category,
      status: input.status,
      transactionDate: input.transactionDate,
    });
  }
}

export { TransactionRepositoryHookAdapter };
