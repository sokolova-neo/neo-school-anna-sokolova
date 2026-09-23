import { ObjectId } from '@neofinancial/neo-framework';
import { NeoFactory } from '@neofinancial/neo-test-factory';

import { RewardAccount } from '../../../src/domain/entities/reward-account/reward-account';

const rewardAccountFactory = NeoFactory.define<RewardAccount>(() => ({
  id: new ObjectId().toString(),
  userId: new ObjectId().toString(),
  rewardPlanId: new ObjectId().toString(),
}));

export { rewardAccountFactory };
