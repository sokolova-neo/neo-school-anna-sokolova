import { faker } from '@faker-js/faker';
import { ObjectId } from '@neofinancial/neo-framework';
import { NeoFactory } from '@neofinancial/neo-test-factory';

import { PlanBenefit, RewardLevel, RewardPlan } from '../../../src/domain/entities/reward-plan/reward-plan';
import { TransactionCategory } from '../../../src/domain/entities/transaction';

const planBenefitFactory = NeoFactory.define<PlanBenefit>(() => ({
  category: faker.helpers.enumValue(TransactionCategory),
  rewardBoost: faker.number.float({ max: 1, min: 0.01, precision: 0.01 }),
}));

const rewardPlanFactory = NeoFactory.define<RewardPlan>(() => ({
  benefits: planBenefitFactory.buildList(1),
  id: new ObjectId().toHexString(),
  name: faker.company.buzzVerb(),
  rewardLevel: faker.helpers.enumValue(RewardLevel),
}));

export { rewardPlanFactory, planBenefitFactory };
