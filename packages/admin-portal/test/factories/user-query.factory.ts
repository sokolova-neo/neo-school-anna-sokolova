import ObjectId from 'bson-objectid';
import { faker } from '@faker-js/faker';

import { NeoFactory } from '@neofinancial/neo-test-factory';

import type { UserQuery } from '../../src/features/user-details/api/__graphql/use-user-details-query.generated.d';

import { Province, UserStatus } from '../../src/types/user';

const UserQueryFactory = NeoFactory.define<UserQuery['user']>(() => ({
  __typename: 'User',
  id: new ObjectId().toHexString(),
  email: faker.internet.email().toString(),
  phone: faker.phone.number(),
  firstName: faker.person.firstName(),
  preferredName: faker.person.middleName(),
  lastName: faker.person.lastName(),
  dateOfBirth: faker.date.past().toString(),
  status: faker.helpers.enumValue(UserStatus),
  province: faker.helpers.enumValue(Province),
}));

export { UserQueryFactory };
