// ******** THIS FILE IS GENERATED, MANUAL CHANGES WILL BE OVERWRITTEN ******** //
/* eslint-disable import/no-restricted-paths */

import { asyncLogger, BaseQueueConsumerManager, singleton } from '@neofinancial/neo-framework';

import { inject } from '../../lib/strict-inject';

import { ReplicatedUserRepositoryAdapter } from '../../infrastructure/repositories/replicated-user/replicated-user.repository.adapter';

@singleton()
class QueueConsumerManager extends BaseQueueConsumerManager {
  constructor(@inject('ReplicatedUserRepository') replicatedUserRepositoryAdapter: ReplicatedUserRepositoryAdapter) {
    super();
    asyncLogger.debug('Initializing queue consumers');

    this.consumers = [replicatedUserRepositoryAdapter.consumer];
  }
}

export { QueueConsumerManager };
