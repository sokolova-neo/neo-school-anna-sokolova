import { vstub } from '@neofinancial/neo-framework';

import { getDependencyRegistryInstance } from '../../../../src/configuration/dependency-registry';
import { TransactionCreatedProducerPort } from '../../../../src/domain/producers/events/transaction-created.producer.port';
import { TransactionRepositoryHookPort } from '../../../../src/domain/repositories/transaction.repository.hook.port';
import { TransactionRepositoryHookAdapter } from '../../../../src/infrastructure/repositories/transaction/transaction.repository.hook';
import { ProducerTokens } from '../../../../src/lib/producer-tokens';
import { transactionFactory } from '../../../factories/transaction/transaction.factory';

describe('TransactionRepositoryHookAdapter', () => {
  const dependencyRegistry = getDependencyRegistryInstance();
  const stubTransactionCreatedProducer = vstub<TransactionCreatedProducerPort>();

  let hook: TransactionRepositoryHookPort;

  beforeAll(() => {
    dependencyRegistry.registerInstance(ProducerTokens.TransactionCreatedProducer, stubTransactionCreatedProducer);

    hook = dependencyRegistry.resolve(TransactionRepositoryHookAdapter);
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('onCreate', () => {
    it('should call transactionProducer.send', async () => {
      const transaction = transactionFactory.build();

      await hook.onCreate(transaction);

      expect(stubTransactionCreatedProducer.send).toHaveBeenCalledOnce();
      expect(stubTransactionCreatedProducer.send).toHaveBeenCalledWith(transaction);
    });
  });
});
