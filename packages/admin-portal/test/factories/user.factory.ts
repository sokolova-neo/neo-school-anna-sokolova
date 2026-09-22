import ObjectId from 'bson-objectid';
import { faker } from '@faker-js/faker';

import { NeoFactory } from '@neofinancial/neo-test-factory';

import { Province, type User, UserStatus } from '../../src/types/user';

const UserFactory = NeoFactory.define<User>(() => ({
  id: new ObjectId().toHexString(),
  firstName: faker.person.firstName(),
  preferredName: faker.person.middleName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  dateOfBirth: faker.date.past(),
  status: faker.helpers.enumValue(UserStatus),
  province: faker.helpers.enumValue(Province),
}));

export { UserFactory };
