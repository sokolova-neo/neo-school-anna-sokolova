import 'reflect-metadata';
import { afterAll, beforeAll } from 'vitest';

import { connect, Mongoose } from '@neofinancial/neo-framework';

import { getDependencyRegistryInstance } from '../../../src/configuration/dependency-registry';

let db: Mongoose;

beforeAll(async () => {
  const dependencyRegistry = getDependencyRegistryInstance();

  db = await connect(dependencyRegistry.resolve(Mongoose));
});

afterAll(async () => {
  await db.disconnect();
});
