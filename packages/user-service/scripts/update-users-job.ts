// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';
import { Province } from '@neofinancial/neo-date';
import { connect, Mongoose } from '@neofinancial/neo-framework';

import { sleep } from '@neofinancial/neo-migration';

import { getDependencyRegistryInstance } from '../src/configuration/dependency-registry';
import { Status } from '../src/domain/entities/user';
import { UserRepositoryPort } from '../src/domain/repositories/user.repository.port';
import { RepositoryTokens } from '../src/lib/repository-tokens';
import { userFactory } from '../test/factories/user/user.factory';

const getNewStatus = (status: Status): Status => {
  const shouldChangeStatus = faker.datatype.boolean(0.2);

  if (!shouldChangeStatus) {
    return status;
  }

  if (status === Status.PENDING) {
    return Status.ACTIVE;
  }

  if (status === Status.ACTIVE) {
    return Status.FROZEN;
  }

  return Status.ACTIVE;
};

const getNewProvince = (oldProvince: Province): Province => {
  const shouldChangeProvince = faker.datatype.boolean(0.4);

  if (!shouldChangeProvince) {
    return oldProvince;
  }

  const moveableProvinces = Object.values(Province).filter((province) => province !== oldProvince);

  return faker.helpers.arrayElement(moveableProvinces);
};

(async (): Promise<void> => {
  const dependencyRegistry = getDependencyRegistryInstance();
  const userRepository = dependencyRegistry.resolve<UserRepositoryPort>(RepositoryTokens.UserRepository);

  const mongoose = dependencyRegistry.resolve(Mongoose);

  await connect(mongoose);

  const updateUser = async (): Promise<void> => {
    const currentStatus = faker.helpers.enumValue(Status);

    const users = await userRepository.findByRelativeCursorQuery({
      primaryCursor: {
        field: '_id',
        sort: 'ASC',
        type: 'OBJECT_ID',
      },
      filter: [
        {
          field: 'status',
          type: 'STRING',
          operator: 'EQ',
          value: currentStatus,
        },
      ],
      limit: 100,
    });

    const userToUpdate = faker.helpers.arrayElement(users.results);

    await userRepository.updateOneByFields(
      {
        id: userToUpdate.id,
      },
      {
        province: getNewProvince(userToUpdate.province),
        status: getNewStatus(userToUpdate.status),
        phone: faker.phone.number('##########'),
      },
    );
  };

  const createUser = async (): Promise<void> => {
    const newUser = userFactory.build({
      status: Status.PENDING,
    });

    await userRepository.create(newUser);
  };

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const shouldCreate = faker.datatype.boolean(0.2);

    if (shouldCreate) {
      await createUser();
    } else {
      await updateUser();
    }

    await sleep(
      faker.number.int({
        min: 2000,
        max: 60000,
      }),
    );
  }
})();
