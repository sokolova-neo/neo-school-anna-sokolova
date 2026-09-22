import { faker } from '@faker-js/faker';
import {
  ObjectId,
  RelativeCursorResultList,
  RelativeQuerySortDirection,
  RelativeQueryValueType,
} from '@neofinancial/neo-framework';
import { NeoFactory } from '@neofinancial/neo-test-factory';

import { User } from '../../../src/domain/entities/user';
import { userFactory } from './user.factory';

const userListFactory = NeoFactory.define<RelativeCursorResultList<User>>(() => ({
  results: userFactory.buildList(2),
  hasNextPage: faker.datatype.boolean(),
  primaryCursor: {
    cursor: new ObjectId().toHexString(),
    field: '_id',
    type: RelativeQueryValueType.OBJECT_ID,
    sort: RelativeQuerySortDirection.ASC,
  },
}));

export { userListFactory };
