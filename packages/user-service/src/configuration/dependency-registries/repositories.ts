// ******** THIS FILE IS GENERATED, MANUAL CHANGES WILL BE OVERWRITTEN ******** //

import config from 'config-dug';

import { createMongoose, DependencyRegistry, instanceCachingFactory, Mongoose } from '@neofinancial/neo-framework';

import { UserRepositoryAdapter } from '../../infrastructure/repositories/user/user.repository.adapter';

function registerRepositories(this: DependencyRegistry): void {
  this.container.register(Mongoose, {
    useFactory: instanceCachingFactory(() => createMongoose(config.MONGO_CONNECTION_STRING as string)),
  });
  UserRepositoryAdapter;
}

export { registerRepositories };
