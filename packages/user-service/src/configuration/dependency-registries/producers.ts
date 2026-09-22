// ******** THIS FILE IS GENERATED, MANUAL CHANGES WILL BE OVERWRITTEN ******** //

import { DependencyRegistry } from '@neofinancial/neo-framework';

import { ReplicatedUserProducerAdapter } from '../../infrastructure/producers/events/replicated-user.producer.adapter';

function registerProducers(this: DependencyRegistry): void {
  ReplicatedUserProducerAdapter;
}

export { registerProducers };
