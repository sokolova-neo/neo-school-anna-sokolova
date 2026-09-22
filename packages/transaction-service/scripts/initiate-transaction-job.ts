// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import config from 'config-dug';

import { asyncLogger, connect, createMongoose, Document } from '@neofinancial/neo-framework';
import { sleep } from '@neofinancial/neo-migration';

import { getDependencyRegistryInstance } from '../src/configuration/dependency-registry';
import { TransactionInitiatedTaskProducerPort } from '../src/domain/producers/task/transaction-initiated-task.producer.port';
import { ProducerTokens } from '../src/lib/producer-tokens';
import { transactionFactory } from '../test/factories/transaction/transaction.factory';

(async (): Promise<void> => {
  const dependencyRegistry = getDependencyRegistryInstance();

  const createTransactionTaskProducer = dependencyRegistry.resolve<TransactionInitiatedTaskProducerPort>(
    ProducerTokens.TransactionInitiatedTaskProducer,
  );
  const transactionConnection = await connect(createMongoose(config.MONGO_CONNECTION_STRING as string));
  const replicatedUserCollection = transactionConnection.connection
    .useDb('transactionService')
    .collection('replicated_users');
  const users = await replicatedUserCollection.find({}).project<Document>({ _id: 1 }).toArray();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const user = faker.helpers.arrayElement(users);

    const transaction = transactionFactory.build({
      userId: user._id.toHexString(),
      transactionDate: new Date(),
    });

    await createTransactionTaskProducer.send({
      externalId: transaction.externalId,
      userId: transaction.userId,
      amountCents: transaction.amountCents,
      transactionDate: transaction.transactionDate,
      status: transaction.status,
      category: transaction.category,
    });

    asyncLogger.info('Sent create transaction task message', {
      transaction,
    });

    await sleep(
      faker.number.int({
        min: 800,
        max: 8000,
      }),
    );
  }
})();
