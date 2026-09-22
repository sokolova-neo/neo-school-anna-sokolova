import { faker } from '@faker-js/faker';
import { ObjectId } from '@neofinancial/neo-framework';
import { NeoFactory } from '@neofinancial/neo-test-factory';

import { TransactionCategory, TransactionStatus } from '../../../src/domain/entities/transaction/transaction';
import { CreateTransaction } from '../../../src/domain/repositories/transaction.repository.port';

const createTransactionFactory = NeoFactory.define<CreateTransaction>(() => ({
  externalId: faker.string.uuid(),
  userId: new ObjectId().toHexString(),
  amountCents: faker.number.int(),
  transactionDate: faker.date.recent(),
  status: faker.helpers.enumValue(TransactionStatus),
  category: faker.helpers.enumValue(TransactionCategory),
}));

export { createTransactionFactory };
