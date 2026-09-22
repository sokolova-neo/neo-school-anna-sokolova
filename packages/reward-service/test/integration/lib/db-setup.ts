/* eslint-disable no-console */
import { createMongoose } from '@neofinancial/neo-framework';

import config from 'config-dug';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

import 'reflect-metadata';

const formatMemoryUsage = (data: number) => `${Math.round((data / 1024 / 1024) * 100) / 100} MB`;

let mongoServer: MongoMemoryServer;

/**
 * @remarks
 * https://vitest.dev/config/#globalsetup
 */
export async function setup(): Promise<void> {
  console.log('entering db setup');

  const { heapTotal: heapTotalBefore, heapUsed: heapUsedBefore } = process.memoryUsage();

  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'test',
      storageEngine: 'wiredTiger',
    },
    binary: {
      version: (config.MONGO_VERSION as string) || 'latest',
    },
  });

  const uri = mongoServer.getUri();
  const mongoUri = uri.slice(0, uri.lastIndexOf('/'));

  process.env.MONGO_URL = mongoUri;
  console.log(process.env.MONGO_URL);

  console.table({
    mongoUri,
    heapTotal: formatMemoryUsage(heapTotalBefore),
    heapUsed: formatMemoryUsage(heapUsedBefore),
  });

  const mongoose = createMongoose(`${mongoUri}/rewardService`);

  const db = await mongoose.connect(mongoose.connectionString);

  await db.connection.db.dropDatabase();
  await db.disconnect();
}

/**
 * @remarks
 * https://vitest.dev/config/#globalsetup
 */
export async function teardown(): Promise<void> {
  console.log('entering db teardown');

  const { heapTotal: heapTotalAfter, heapUsed: heapUsedAfter } = process.memoryUsage();

  await mongoServer.stop();

  console.log({
    heapTotal: formatMemoryUsage(heapTotalAfter),
    heapUsed: formatMemoryUsage(heapUsedAfter),
  });
}
