import { InvalidStateError, Provider, RelativeCursorResultList, RelativeQueryInput } from '@neofinancial/neo-framework';

import { RepositoryTokens } from '../../../lib/repository-tokens';
import { inject } from '../../../lib/strict-inject';
import { UserStatus } from '../../entities/replicated-user/replicated-user';
import { Transaction } from '../../entities/transaction/transaction';
import { ReplicatedUserRepositoryPort } from '../../repositories/replicated-user.repository.port';
import { CreateTransaction, TransactionRepositoryPort } from '../../repositories/transaction.repository.port';
import { TransactionProviderPort } from './transaction.provider.port';

@Provider
class TransactionProviderAdapter implements TransactionProviderPort {
  constructor(
    @inject(RepositoryTokens.TransactionRepository)
    private transactionRepository: TransactionRepositoryPort,
    @inject(RepositoryTokens.ReplicatedUserRepository)
    private replicatedUserRepository: ReplicatedUserRepositoryPort,
  ) {}

  public async getTransactions(input: RelativeQueryInput): Promise<RelativeCursorResultList<Transaction>> {
    return this.transactionRepository.findByRelativeCursorQuery(input);
  }

  public async createTransaction(input: CreateTransaction): Promise<Transaction> {
    const user = await this.replicatedUserRepository.findById(input.userId);

    if (user.status === UserStatus.PENDING) {
      throw new InvalidStateError('Transaction was created for user in a pending state.', {
        logData: {
          ...input,
        },
        logToSentry: 'MEDIUM',
      });
    }

    const transaction = await this.transactionRepository.getOrCreateOneByExternalId(input.externalId, input);

    return transaction;
  }
}

export { TransactionProviderAdapter };
