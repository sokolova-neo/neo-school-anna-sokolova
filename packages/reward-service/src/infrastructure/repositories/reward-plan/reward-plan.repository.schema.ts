import { Document, Schema } from '@neofinancial/neo-framework';

import { RewardLevel, RewardPlan } from '../../../domain/entities/reward-plan/reward-plan';
import { getPlanBenefitSchema, PlanBenefitDocument } from './subdoc/plan-benefit.subdoc';

export interface RewardPlanDocument extends Document, Omit<RewardPlan, 'id' | 'benefits'> {
  benefits: PlanBenefitDocument[];
}

const getRewardPlanSchema = (): Schema => {
  const schema = new Schema({
    name: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    rewardLevel: {
      type: Schema.Types.String,
      required: true,
      enum: Object.values(RewardLevel),
      unique: true,
    },
    benefits: {
      type: [getPlanBenefitSchema()],
      required: true,
    },
  });

  return schema;
};

export { getRewardPlanSchema };
