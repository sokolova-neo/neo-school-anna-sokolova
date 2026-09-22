import { BaseObservableRepository, ObservableRepository } from '@neofinancial/neo-framework';

import { Transaction } from '../../../domain/entities/transaction/transaction';
import {
  CreateTransaction,
  TransactionRepositoryPort,
  UpdateTransaction,
} from '../../../domain/repositories/transaction.repository.port';
import { TransactionRepositoryHookAdapter } from './transaction.repository.hook';
import { getTransactionSchema, TransactionDocument } from './transaction.repository.schema';

@ObservableRepository('Transaction', getTransactionSchema(), TransactionRepositoryHookAdapter)
class TransactionRepositoryAdapter
  extends BaseObservableRepository<TransactionDocument, Transaction, CreateTransaction, UpdateTransaction>
  implements TransactionRepositoryPort
{
  private readonly DUPLICATE_KEY_ERROR_CODE = 11000;

  protected toObject(document: TransactionDocument): Transaction {
    return {
      id: document._id.toHexString(),
      externalId: document.externalId,
      userId: document.userId.toHexString(),
      amountCents: document.amountCents,
      transactionDate: document.transactionDate,
      status: document.status,
      category: document.category,
    };
  }

  public async getOrCreateOneByExternalId(
    externalId: string,
    input: CreateTransaction,
    isRetry?: boolean,
  ): Promise<Transaction> {
    try {
      const existingTransaction = await this.findOneByFields({
        externalId,
      });

      if (existingTransaction) {
        return existingTransaction;
      }

      const transaction = await this.create(input);

      return transaction;
    } catch (error) {
      if (error.code === this.DUPLICATE_KEY_ERROR_CODE && !isRetry) {
        return this.getOrCreateOneByExternalId(externalId, input, true);
      }

      throw this.errorHandler('getOrCreateOneByExternalId', { externalId, input }, error);
    }
  }
}

export { TransactionRepositoryAdapter };
