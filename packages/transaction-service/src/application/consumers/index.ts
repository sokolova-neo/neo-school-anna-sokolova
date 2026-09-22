// ******** THIS FILE IS GENERATED, MANUAL CHANGES WILL BE OVERWRITTEN ******** //
/* eslint-disable import/no-restricted-paths */

import { asyncLogger, BaseQueueConsumerManager, singleton } from '@neofinancial/neo-framework';

import { inject } from '../../lib/strict-inject';

import { TransactionInitiatedTaskConsumer } from './tasks/transaction-initiated-task.consumer';
import { ReplicatedUserRepositoryAdapter } from '../../infrastructure/repositories/replicated-user/replicated-user.repository.adapter';

@singleton()
class QueueConsumerManager extends BaseQueueConsumerManager {
  constructor(
    transactionInitiatedTaskConsumer: TransactionInitiatedTaskConsumer,
    @inject('ReplicatedUserRepository') replicatedUserRepositoryAdapter: ReplicatedUserRepositoryAdapter,
  ) {
    super();
    asyncLogger.debug('Initializing queue consumers');

    this.consumers = [transactionInitiatedTaskConsumer, replicatedUserRepositoryAdapter.consumer];
  }
}

export { QueueConsumerManager };
