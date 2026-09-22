import { faker } from '@faker-js/faker';

import { NeoFactory } from '@neofinancial/neo-test-factory';
import { RelativeQueryInput, RelativeQuerySortDirection, RelativeQueryValueType } from '@neofinancial/neo-framework';

const transactionRelativeQueryInputFactory = NeoFactory.define<RelativeQueryInput>(() => ({
  filter: [],
  limit: faker.number.int({ max: 50 }),
  primaryCursor: {
    field: faker.lorem.word(),
    sort: faker.helpers.enumValue(RelativeQuerySortDirection),
    type: faker.helpers.enumValue(RelativeQueryValueType),
  },
}));

export { transactionRelativeQueryInputFactory };
