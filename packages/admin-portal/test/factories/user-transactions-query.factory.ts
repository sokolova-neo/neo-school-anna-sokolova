import ObjectId from 'bson-objectid';
import { faker } from '@faker-js/faker';

import { NeoFactory } from '@neofinancial/neo-test-factory';
import { type UserTransactionsQuery } from '../../src/features/user-transactions/api/__graphql/use-user-transactions-query.generated.d';
import { TransactionQueryFactory } from './transaction-query.factory';

const UserTransactionsQueryFactory = NeoFactory.define<
  UserTransactionsQuery['user']['transactions']
>(() => ({
  __typename: 'TransactionList',
  results: TransactionQueryFactory.buildList(10),
  hasNextPage: faker.datatype.boolean(),
  primaryCursor: {
    cursor: new ObjectId().toHexString(),
  },
  secondaryCursor: {
    cursor: new ObjectId().toHexString(),
  },
}));

export { UserTransactionsQueryFactory };
