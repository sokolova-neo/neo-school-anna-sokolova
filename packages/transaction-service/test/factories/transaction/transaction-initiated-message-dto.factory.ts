import { faker } from '@faker-js/faker';
import { ObjectId } from '@neofinancial/neo-framework';
import { NeoFactory } from '@neofinancial/neo-test-factory';

import { TransactionCategory, TransactionStatus } from '../../../src/domain/entities/transaction/transaction';
import { TransactionInitiatedMessageDTO } from '../../../src/application/consumers/tasks/transaction-initiated-task.consumer';

const transactionInitiatedMessageDTOFactory = NeoFactory.define<TransactionInitiatedMessageDTO>(() => ({
  externalId: faker.string.uuid(),
  userId: new ObjectId().toHexString(),
  amountCents: faker.number.int(),
  transactionDate: faker.date.recent().toISOString(),
  status: faker.helpers.enumValue(TransactionStatus),
  category: faker.helpers.enumValue(TransactionCategory),
}));

export { transactionInitiatedMessageDTOFactory };
