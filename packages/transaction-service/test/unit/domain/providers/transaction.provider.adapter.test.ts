import { vstub } from '@neofinancial/neo-framework';

import { getDependencyRegistryInstance } from '../../../../src/configuration/dependency-registry';
import { UserStatus } from '../../../../src/domain/entities/replicated-user/replicated-user';
import { TransactionProviderAdapter } from '../../../../src/domain/providers/transactions/transaction.provider.adapter';
import { ReplicatedUserRepositoryPort } from '../../../../src/domain/repositories/replicated-user.repository.port';
import { TransactionRepositoryPort } from '../../../../src/domain/repositories/transaction.repository.port';
import { ProviderTokens } from '../../../../src/lib/provider-tokens';
import { RepositoryTokens } from '../../../../src/lib/repository-tokens';
import { replicatedUserFactory } from '../../../factories/replicated-user/replicated-user.factory';
import { createTransactionFactory } from '../../../factories/transaction/create-transaction.factory';
import { transactionListFactory } from '../../../factories/transaction/transaction-list.factory';
import { transactionRelativeQueryInputFactory } from '../../../factories/transaction/transaction-relative-query-input.factory';
import { transactionFactory } from '../../../factories/transaction/transaction.factory';

describe('TransactionProviderAdapter', () => {
  const stubTransactionRepository = vstub<TransactionRepositoryPort>();
  const stubReplicatedUserRepository = vstub<ReplicatedUserRepositoryPort>();
  const dependencyRegistry = getDependencyRegistryInstance();

  let provider: TransactionProviderAdapter;

  const setupDependencies = () => {
    dependencyRegistry.registerInstance(RepositoryTokens.TransactionRepository, stubTransactionRepository);
    dependencyRegistry.registerInstance(RepositoryTokens.ReplicatedUserRepository, stubReplicatedUserRepository);

    provider = dependencyRegistry.resolve(ProviderTokens.TransactionProvider);
  };

  beforeAll(() => {
    setupDependencies();
  });

  afterAll(() => {
    dependencyRegistry.container.clearInstances();
  });

  describe('getTransactions', () => {
    const mockInput = transactionRelativeQueryInputFactory.build();
    const mockTransactionList = transactionListFactory.build();

    it('should return a transaction list', async () => {
      stubTransactionRepository.findByRelativeCursorQuery.mockResolvedValueOnce(mockTransactionList);

      const result = await provider.getTransactions(mockInput);

      expect(result).toEqual(mockTransactionList);
    });

    it('should call transactionRepository.findByRelativeCursorQuery', async () => {
      await provider.getTransactions(mockInput);

      expect(stubTransactionRepository.findByRelativeCursorQuery).toHaveBeenCalledOnce();
      expect(stubTransactionRepository.findByRelativeCursorQuery).toHaveBeenCalledWith(mockInput);
    });
  });

  describe('createTransaction', () => {
    const mockInput = createTransactionFactory.build();
    const mockTransaction = transactionFactory.build();

    describe('with an active user', () => {
      const mockValidUser = replicatedUserFactory.active().build();

      beforeEach(() => {
        stubReplicatedUserRepository.findById.mockResolvedValueOnce(mockValidUser);
        stubTransactionRepository.getOrCreateOneByExternalId.mockResolvedValueOnce(mockTransaction);
      });
      it('should return a transaction', async () => {
        const result = await provider.createTransaction(mockInput);

        expect(result).toEqual(mockTransaction);
      });

      it('should call transactionRepository.create', async () => {
        await provider.createTransaction(mockInput);

        expect(stubTransactionRepository.getOrCreateOneByExternalId).toHaveBeenCalledOnce();
        expect(stubTransactionRepository.getOrCreateOneByExternalId).toHaveBeenCalledWith(
          mockInput.externalId,
          mockInput,
        );
      });
    });

    describe('with an user with a pending status', () => {
      it('should throw an error', async () => {
        const mockPendingUser = replicatedUserFactory.build({
          status: UserStatus.PENDING,
        });

        stubReplicatedUserRepository.findById.mockResolvedValueOnce(mockPendingUser);

        await expect(provider.createTransaction(mockInput)).rejects.toThrow(
          'Transaction was created for user in a pending state.',
        );
      });
    });
  });
});
