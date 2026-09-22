// ******** THIS FILE IS GENERATED, MANUAL CHANGES WILL BE OVERWRITTEN ******** //

import { DependencyRegistry } from '@neofinancial/neo-framework';

import { TransactionCreatedProducerAdapter } from '../../infrastructure/producers/events/transaction-created.producer.adapter';
import { TransactionInitiatedTaskProducerAdapter } from '../../infrastructure/producers/task/transaction-initiated-task.producer.adapter';

function registerProducers(this: DependencyRegistry): void {
  TransactionCreatedProducerAdapter;
  TransactionInitiatedTaskProducerAdapter;
}

export { registerProducers };
