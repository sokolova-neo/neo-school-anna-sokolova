import { faker } from '@faker-js/faker';
import { NeoFactory } from '@neofinancial/neo-test-factory';

import { RewardAccount } from '../../../src/domain/entities/reward-account/reward-account';

const rewardAccountFactory = NeoFactory.define<RewardAccount>(() => ({
  id: faker.database.mongodbObjectId(),
  userId: faker.database.mongodbObjectId(),
  rewardPlanId: faker.database.mongodbObjectId(),
}));

export { rewardAccountFactory };
