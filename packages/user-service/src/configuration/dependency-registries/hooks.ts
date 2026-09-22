import { DependencyRegistry } from '../dependency-registry';
import { UserReplicationRepositoryHookAdapter } from '../../infrastructure/repositories/user/user-replication.repository.hook';
function registerRepositoryHooks(this: DependencyRegistry): void {
  UserReplicationRepositoryHookAdapter;
}

export { registerRepositoryHooks };
