import { Document, Schema } from '@neofinancial/neo-framework';

import { PlanBenefit } from '../../../../domain/entities/reward-plan/reward-plan';
import { TransactionCategory } from '../../../../domain/entities/transaction';

export interface PlanBenefitDocument extends Document, PlanBenefit {}

const getPlanBenefitSchema = (): Schema =>
  new Schema(
    {
      category: {
        type: Schema.Types.String,
        required: true,
        enum: Object.values(TransactionCategory),
        unique: true,
      },
      rewardBoost: {
        type: Schema.Types.Number,
        max: 1,
        min: 0.01,
        required: true,
      },
    },
    {
      _id: false,
      id: false,
      version: false,
      timestamps: false,
    },
  );

const mapPlanBenefitSubdocToDomain = (document: PlanBenefitDocument): PlanBenefit => ({
  category: document.category,
  rewardBoost: document.rewardBoost,
});

export { getPlanBenefitSchema, mapPlanBenefitSubdocToDomain };
