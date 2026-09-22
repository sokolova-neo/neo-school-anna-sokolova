import ObjectId from 'bson-objectid';
import { faker } from '@faker-js/faker';

import { NeoFactory } from '@neofinancial/neo-test-factory';
import { type UserTransactionsQuery } from '../../src/features/user-transactions/api/__graphql/use-user-transactions-query.generated.d';

import {
  TransactionCategory,
  TransactionStatus,
} from '../../src/types/transaction';

const TransactionQueryFactory = NeoFactory.define<
  UserTransactionsQuery['user']['transactions']['results'][number]
>(() => ({
  __typename: 'Transaction',
  id: new ObjectId().toHexString(),
  amountCents: faker.number.int({ min: 150, max: 1_000_00 }),
  status: faker.helpers.enumValue(TransactionStatus),
  category: faker.helpers.enumValue(TransactionCategory),
  transactionDate: faker.date.past().toString(),
}));

export { TransactionQueryFactory };
