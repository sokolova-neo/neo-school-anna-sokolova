import { faker } from '@faker-js/faker';

import {
  ObjectId,
  RelativeCursorResultList,
  RelativeQuerySortDirection,
  RelativeQueryValueType,
} from '@neofinancial/neo-framework';
import { NeoFactory } from '@neofinancial/neo-test-factory';

import { Transaction } from '../../../src/domain/entities/transaction/transaction';
import { transactionFactory } from './transaction.factory';

const transactionListFactory = NeoFactory.define<RelativeCursorResultList<Transaction>>(() => {
  return {
    hasNextPage: faker.datatype.boolean(),
    results: transactionFactory.buildList(faker.number.int({ max: 10 })),
    primaryCursor: {
      field: faker.helpers.arrayElement(Object.keys(transactionFactory.build())),
      sort: faker.helpers.enumValue(RelativeQuerySortDirection),
      type: faker.helpers.enumValue(RelativeQueryValueType),
      cursor: new ObjectId().toHexString(),
    },
    secondaryCursor: {
      field: faker.helpers.arrayElement(Object.keys(transactionFactory.build())),
      sort: faker.helpers.enumValue(RelativeQuerySortDirection),
      type: faker.helpers.enumValue(RelativeQueryValueType),
      cursor: new ObjectId().toHexString(),
    },
  };
});

export { transactionListFactory };
