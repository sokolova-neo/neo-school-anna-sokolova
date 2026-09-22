import { faker } from '@faker-js/faker';
import { ObjectId } from '@neofinancial/neo-framework';
import { NeoFactory } from '@neofinancial/neo-test-factory';

import {
  Transaction,
  TransactionCategory,
  TransactionStatus,
} from '../../../src/domain/entities/transaction/transaction';

class TransactionFactory extends NeoFactory<Transaction> {
  isSuccessful() {
    return this.params({
      status: TransactionStatus.SUCCESS,
    });
  }

  isPending() {
    return this.params({
      status: TransactionStatus.PENDING,
    });
  }

  isFailed() {
    return this.params({
      status: TransactionStatus.FAILED,
    });
  }
}

const transactionFactory = TransactionFactory.define(() => ({
  id: new ObjectId().toHexString(),
  externalId: faker.string.uuid(),
  userId: new ObjectId().toHexString(),
  amountCents: faker.number.int({ min: 150, max: 1_000_00 }),
  transactionDate: faker.date.recent({
    days: 60,
  }),
  status: faker.helpers.enumValue(TransactionStatus),
  category: faker.helpers.enumValue(TransactionCategory),
}));

export { transactionFactory };
