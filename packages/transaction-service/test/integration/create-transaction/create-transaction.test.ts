import { vstub } from '@neofinancial/neo-framework';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { faker } from '@faker-js/faker';

import {
  TransactionInitiatedMessageDTO,
  TransactionInitiatedTaskConsumer,
} from '../../../src/application/consumers/tasks/transaction-initiated-task.consumer';

import { getDependencyRegistryInstance } from '../../../src/configuration/dependency-registry';
import { ReplicatedUser, UserStatus } from '../../../src/domain/entities/replicated-user/replicated-user';
import { Transaction } from '../../../src/domain/entities/transaction/transaction';
import { TransactionCreatedProducerPort } from '../../../src/domain/producers/events/transaction-created.producer.port';
import { ReplicatedUserRepositoryPort } from '../../../src/domain/repositories/replicated-user.repository.port';
import { TransactionRepositoryPort } from '../../../src/domain/repositories/transaction.repository.port';
import { ProducerTokens } from '../../../src/lib/producer-tokens';
import { RepositoryTokens } from '../../../src/lib/repository-tokens';
import { replicatedUserFactory } from '../../factories/replicated-user/replicated-user.factory';
import { transactionInitiatedMessageDTOFactory } from '../../factories/transaction/transaction-initiated-message-dto.factory';

describe('Create Transaction Integration Tests', () => {
  const dependencyRegistry = getDependencyRegistryInstance();
  const stubTransactionCreatedProducer = vstub<TransactionCreatedProducerPort>();

  let transactionInitiatedConsumer: TransactionInitiatedTaskConsumer;
  let transactionRepository: TransactionRepositoryPort;
  let replicatedUserRepository: ReplicatedUserRepositoryPort;

  let message: TransactionInitiatedMessageDTO;
  let user: ReplicatedUser;
  let transaction: Transaction;
  let error: Error;

  beforeAll(() => {
    dependencyRegistry.register(ProducerTokens.TransactionCreatedProducer, {
      useValue: stubTransactionCreatedProducer,
    });
  });

  beforeEach(() => {
    vi.resetAllMocks();
    transactionInitiatedConsumer = dependencyRegistry.resolve(TransactionInitiatedTaskConsumer);
    transactionRepository = dependencyRegistry.resolve(RepositoryTokens.TransactionRepository);
    replicatedUserRepository = dependencyRegistry.resolve(RepositoryTokens.ReplicatedUserRepository);
  });

  describe('when a transaction for an active user is received', () => {
    beforeEach(async () => {
      user = replicatedUserFactory.active().build();
      await replicatedUserRepository.replicateData(user);

      message = transactionInitiatedMessageDTOFactory.build({
        userId: user.id,
      });

      await transactionInitiatedConsumer.messageHandler(message, {
        sqsMessageId: faker.database.mongodbObjectId().toString(),
      });
    });

    it('should create a transaction', async () => {
      transaction = await transactionRepository.findOneByFields({
        externalId: message.externalId,
      });

      expect(transaction).toEqual({
        id: expect.any(String),
        externalId: message.externalId,
        userId: message.userId,
        amountCents: message.amountCents,
        transactionDate: new Date(message.transactionDate),
        status: message.status,
        category: message.category,
      });
    });

    it('should send a transaction created message', () => {
      expect(stubTransactionCreatedProducer.send).toHaveBeenCalledOnce();
      expect(stubTransactionCreatedProducer.send).toHaveBeenCalledWith({
        id: expect.any(String),
        externalId: message.externalId,
        userId: message.userId,
        amountCents: message.amountCents,
        transactionDate: new Date(message.transactionDate),
        status: message.status,
        category: message.category,
      });
    });
  });

  describe('when a transaction for a pending user is received', () => {
    beforeEach(async () => {
      user = replicatedUserFactory.build({
        status: UserStatus.PENDING,
      });
      await replicatedUserRepository.replicateData(user);

      message = transactionInitiatedMessageDTOFactory.build({
        userId: user.id,
      });

      try {
        await transactionInitiatedConsumer.messageHandler(message, {
          sqsMessageId: faker.database.mongodbObjectId().toString(),
        });
      } catch (caughtError) {
        error = caughtError as Error;
      }
    });

    it('should not process the message', () => {
      expect(error.message).toBe('Transaction was created for user in a pending state.');
    });

    it('should not create a transaction', async () => {
      transaction = await transactionRepository.findOneByFields({
        externalId: message.externalId,
      });

      expect(transaction).toBeUndefined();
    });

    it('should not send a transaction created message', () => {
      expect(stubTransactionCreatedProducer.send).not.toHaveBeenCalled();
    });
  });
});
