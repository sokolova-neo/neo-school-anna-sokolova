/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';

import { connect, Mongoose } from '@neofinancial/neo-framework';

import { getDependencyRegistryInstance } from '../src/configuration/dependency-registry';
import { UserStatus } from '../src/domain/entities/replicated-user/replicated-user';
import { ReplicatedUserRepositoryPort } from '../src/domain/repositories/replicated-user.repository.port';
import { TransactionRepositoryPort } from '../src/domain/repositories/transaction.repository.port';
import { RepositoryTokens } from '../src/lib/repository-tokens';
import { transactionFactory } from '../test/factories/transaction/transaction.factory';

const seedTransactions = async (): Promise<void> => {
  const dependencyRegistry = getDependencyRegistryInstance();
  const mongoose = dependencyRegistry.resolve(Mongoose);

  await connect(mongoose);

  const transactionRepository: TransactionRepositoryPort = dependencyRegistry.resolve(
    RepositoryTokens.TransactionRepository,
  );
  const userRepository: ReplicatedUserRepositoryPort = dependencyRegistry.resolve(
    RepositoryTokens.ReplicatedUserRepository,
  );

  const users = await userRepository.findByFields({ status: UserStatus.ACTIVE });

  const transactions = users.flatMap((user) => {
    return transactionFactory.buildList(faker.number.int({ min: 1, max: 30 }), {
      userId: user.id,
    });
  });

  console.log('Seeding transactions');

  const createTransactionPromises = transactions.map(async (transaction) => {
    await transactionRepository.create(transaction);

    console.log(`Created transaction: ${transaction.id}.`);
  });

  await Promise.all(createTransactionPromises);

  console.log('Seeding complete!');

  process.exit(0);
};

void seedTransactions();
