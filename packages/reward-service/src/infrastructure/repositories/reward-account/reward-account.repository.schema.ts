import { Document, Schema } from '@neofinancial/neo-framework';

import { RewardAccount } from '../../../domain/entities/reward-account/reward-account';

export interface RewardAccountDocument extends Document, Omit<RewardAccount, 'id' | 'userId' | 'rewardPlanId'> {
  userId: Schema.Types.ObjectId;
  rewardPlanId: Schema.Types.ObjectId;
}

const getRewardAccountSchema = (): Schema => {
  const schema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    rewardPlanId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  });

  return schema;
};

export { getRewardAccountSchema };
