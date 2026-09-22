import { faker } from '@faker-js/faker';

import { NeoFactory } from '@neofinancial/neo-test-factory';
import { ObjectId } from '@neofinancial/neo-framework';

import { ReplicatedUser, UserStatus } from '../../../src/domain/entities/replicated-user/replicated-user';

class ReplicatedUserFactory extends NeoFactory<ReplicatedUser> {
  inactive() {
    return this.params({
      status: faker.helpers.arrayElement(Object.values(UserStatus).filter((status) => status !== UserStatus.ACTIVE)),
    });
  }

  active() {
    return this.params({
      status: UserStatus.ACTIVE,
    });
  }
}

const replicatedUserFactory = ReplicatedUserFactory.define(() => ({
  id: new ObjectId().toHexString(),
  replicationVersion: faker.number.int(),
  status: faker.helpers.enumValue(UserStatus),
}));

export { replicatedUserFactory };
