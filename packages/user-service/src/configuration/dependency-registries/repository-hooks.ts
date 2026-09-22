// ******** THIS FILE IS GENERATED, MANUAL CHANGES WILL BE OVERWRITTEN ******** //

import { DependencyRegistry } from '@neofinancial/neo-framework';

import { UserReplicationRepositoryHookAdapter } from '../../infrastructure/repositories/user/user-replication.repository.hook';

function registerRepositoryHooks(this: DependencyRegistry): void {
  UserReplicationRepositoryHookAdapter;
}

export { registerRepositoryHooks };
