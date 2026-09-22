import { faker } from '@faker-js/faker';

import { Province } from '@neofinancial/neo-date';
import { ObjectId } from '@neofinancial/neo-framework';
import { NeoFactory } from '@neofinancial/neo-test-factory';

import { Status, User } from '../../../src/domain/entities/user';

const userFactory = NeoFactory.define<User>(() => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    id: new ObjectId().toHexString(),
    replicationVersion: faker.number.int(),
    firstName,
    preferredName: faker.person.middleName(),
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    phone: faker.phone.number('##########'),
    status: faker.helpers.enumValue(Status),
    province: faker.helpers.enumValue(Province),
    dateOfBirth: faker.date.past({ years: 20 }),
  };
});

export { userFactory };
