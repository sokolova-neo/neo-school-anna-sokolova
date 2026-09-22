import { faker } from '@faker-js/faker';

import { vstub } from '@neofinancial/neo-framework';

import { getDependencyRegistryInstance } from '../../../../../src/configuration/dependency-registry';
import { TransactionProviderPort } from '../../../../../src/domain/providers/transactions/transaction.provider.port';
import { TransactionInitiatedTaskConsumer } from '../../../../../src/application/consumers/tasks/transaction-initiated-task.consumer';
import { ProviderTokens } from '../../../../../src/lib/provider-tokens';
import { transactionInitiatedMessageDTOFactory } from '../../../../factories/transaction/transaction-initiated-message-dto.factory';

describe('CreateTransactionTaskConsumer', () => {
  const stubTransactionProvider = vstub<TransactionProviderPort>();
  const dependencyRegistry = getDependencyRegistryInstance();

  let consumer: TransactionInitiatedTaskConsumer;

  const setupDependencies = () => {
    dependencyRegistry.registerInstance(ProviderTokens.TransactionProvider, stubTransactionProvider);

    consumer = dependencyRegistry.resolve(TransactionInitiatedTaskConsumer);
  };

  beforeAll(() => {
    setupDependencies();
  });

  afterAll(() => {
    dependencyRegistry.container.clearInstances();
  });

  describe('messageHandler', () => {
    const mockMessageHandlerDetails = {
      sqsMessageId: faker.string.uuid(),
    };
    const mockMessage = transactionInitiatedMessageDTOFactory.build();

    it('should successfully consume the message', async () => {
      await expect(consumer.messageHandler(mockMessage, mockMessageHandlerDetails)).resolves.not.toThrow();
    });

    it('should throw when an invalid enum value is provided', async () => {
      await expect(
        consumer.messageHandler(
          {
            ...mockMessage,
            status: 'I am a super status!!!',
          },
          mockMessageHandlerDetails,
        ),
      ).rejects.toThrow();
    });

    it('should call transactionProvider.createTransaction', async () => {
      await consumer.messageHandler(mockMessage, mockMessageHandlerDetails);

      expect(stubTransactionProvider.createTransaction).toHaveBeenCalledOnce();
      expect(stubTransactionProvider.createTransaction).toHaveBeenCalledWith({
        ...mockMessage,
        transactionDate: new Date(mockMessage.transactionDate),
      });
    });
  });
});
