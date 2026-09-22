/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';

import { Province } from '@neofinancial/neo-date';
import { connect, Mongoose } from '@neofinancial/neo-framework';

import { getDependencyRegistryInstance } from '../src/configuration/dependency-registry';
import { Status } from '../src/domain/entities/user';
import { UserRepositoryPort } from '../src/domain/repositories/user.repository.port';
import { RepositoryTokens } from '../src/lib/repository-tokens';
import { userFactory } from '../test/factories/user/user.factory';

const seedUsers = async (): Promise<void> => {
  const dependencyRegistry = getDependencyRegistryInstance();
  const mongoose = dependencyRegistry.resolve(Mongoose);

  await connect(mongoose);

  const userRepository: UserRepositoryPort = dependencyRegistry.resolve(RepositoryTokens.UserRepository);
  const users = userFactory.buildList(100);

  console.log('Seeding users');

  const createUserPromises = users.map(async (user) => {
    const hasPreferredName = faker.datatype.boolean();
    const isPossiblyInactive = faker.datatype.boolean({ probability: 0.2 });
    const isPossiblyQuebec = faker.datatype.boolean({ probability: 0.2 });

    await userRepository.create({
      firstName: user.firstName,
      preferredName: hasPreferredName ? user.preferredName : undefined,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      status: isPossiblyInactive ? user.status : Status.ACTIVE,
      province: isPossiblyQuebec ? user.province : Province.QUEBEC,
      replicationVersion: 0,
    });

    console.log(`Created user: ${user.firstName} ${user.lastName}.`);
  });

  await Promise.all(createUserPromises);

  console.log('Seeding complete!');

  process.exit(0);
};

void seedUsers();
