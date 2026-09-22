import { DependencyRegistry } from '../dependency-registry';

function registerConsumers(this: DependencyRegistry): void {
  // No consumers to register - ReplicationConsumerRepository handles user replication now
}

export { registerConsumers };
