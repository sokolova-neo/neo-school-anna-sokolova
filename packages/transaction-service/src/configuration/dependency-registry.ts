import 'reflect-metadata';
import { DependencyRegistry } from '@neofinancial/neo-framework';

import { registerProducers } from './dependency-registries/producers';
import { registerConsumers } from './dependency-registries/consumers';
import { registerProviders } from './dependency-registries/providers';
import { registerRepositories } from './dependency-registries/repositories';
import { registerRepositoryHooks } from './dependency-registries/hooks';

let dependencyRegistry: DependencyRegistry;

const getDependencyRegistryInstance = (): DependencyRegistry => {
  if (!dependencyRegistry) {
    dependencyRegistry = new DependencyRegistry([
      registerRepositories,
      registerProviders,
      registerProducers,
      registerConsumers,
      registerRepositoryHooks,
    ]);
  }

  return dependencyRegistry;
};

export { getDependencyRegistryInstance, DependencyRegistry };
