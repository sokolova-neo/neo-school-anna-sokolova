import { Document, Schema } from '@neofinancial/neo-framework';

import { RewardAccount } from '../../../domain/entities/reward-account/reward-account';

export interface RewardAccountDocument extends Document, Omit<RewardAccount, 'id'> {}

const getRewardAccountSchema = (): Schema => {
  const schema = new Schema({
    userId:{
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    rewardPlanId:{
        type: Schema.Types.String,
        required: true,
    }
  });

  return schema;
};

export { getRewardAccountSchema };
