// ******** THIS FILE IS GENERATED, MANUAL CHANGES WILL BE OVERWRITTEN ******** //

import { asyncLogger, BaseQueueConsumerManager, singleton } from '@neofinancial/neo-framework';

@singleton()
class QueueConsumerManager extends BaseQueueConsumerManager {
  constructor() {
    super();
    asyncLogger.debug('Initializing queue consumers');

    this.consumers = [];
  }
}

export { QueueConsumerManager };
