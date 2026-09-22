import ObjectId from 'bson-objectid';
import { faker } from '@faker-js/faker';

import { NeoFactory } from '@neofinancial/neo-test-factory';

import {
  type Transaction,
  TransactionCategory,
  TransactionStatus,
} from '../../src/types/transaction';

const TransactionFactory = NeoFactory.define<Transaction>(() => ({
  id: new ObjectId().toHexString(),
  amountCents: faker.number.int({ min: 0, max: 1000000 }),
  transactionDate: faker.date.past(),
  status: faker.helpers.enumValue(TransactionStatus),
  category: faker.helpers.enumValue(TransactionCategory),
}));

export { TransactionFactory };
