// ******** THIS FILE IS GENERATED, MANUAL CHANGES WILL BE OVERWRITTEN ******** //

import config from 'config-dug';

import { createMongoose, DependencyRegistry, instanceCachingFactory, Mongoose } from '@neofinancial/neo-framework';

import { ReplicatedUserRepositoryAdapter } from '../../infrastructure/repositories/replicated-user/replicated-user.repository.adapter';
import { TransactionRepositoryAdapter } from '../../infrastructure/repositories/transaction/transaction.repository.adapter';

function registerRepositories(this: DependencyRegistry): void {
  this.container.register(Mongoose, {
    useFactory: instanceCachingFactory(() => createMongoose(config.MONGO_CONNECTION_STRING as string)),
  });
  ReplicatedUserRepositoryAdapter;
  TransactionRepositoryAdapter;
}

export { registerRepositories };
