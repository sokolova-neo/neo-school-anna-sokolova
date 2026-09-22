import { faker } from '@faker-js/faker';

import { NeoFactory } from '@neofinancial/neo-test-factory';
import { ObjectId } from '@neofinancial/neo-framework';
import { Province } from '@neofinancial/neo-date';

import { ReplicatedUser } from '../../../src/domain/entities/replicated-user/replicated-user';

class ReplicatedUserFactory extends NeoFactory<ReplicatedUser> {
  isQuebec() {
    return this.params({
      province: Province.QUEBEC,
    });
  }

  isROC() {
    return this.params({
      province: faker.helpers.arrayElement(Object.values(Province).filter((province) => province !== Province.QUEBEC)),
    });
  }
}

const replicatedUserFactory = ReplicatedUserFactory.define(() => ({
  id: new ObjectId().toHexString(),
  replicationVersion: faker.number.int(),
  province: faker.helpers.enumValue(Province),
}));

export { replicatedUserFactory };
