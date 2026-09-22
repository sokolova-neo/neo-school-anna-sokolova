import { DependencyRegistry } from '../dependency-registry';
import { TransactionRepositoryHookAdapter } from '../../infrastructure/repositories/transaction/transaction.repository.hook';
function registerRepositoryHooks(this: DependencyRegistry): void {
  TransactionRepositoryHookAdapter;
}

export { registerRepositoryHooks };
