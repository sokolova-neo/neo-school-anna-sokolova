// ******** THIS FILE IS GENERATED, MANUAL CHANGES WILL BE OVERWRITTEN ******** //

import { DependencyRegistry } from '@neofinancial/neo-framework';

import { TransactionRepositoryHookAdapter } from '../../infrastructure/repositories/transaction/transaction.repository.hook';

function registerRepositoryHooks(this: DependencyRegistry): void {
  TransactionRepositoryHookAdapter;
}

export { registerRepositoryHooks };
