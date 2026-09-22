import { BaseRepository, Repository } from '@neofinancial/neo-framework';

import { RewardPlan } from '../../../domain/entities/reward-plan/reward-plan';
import {
  CreateRewardPlan,
  RewardPlanRepositoryPort,
  UpdateRewardPlan,
} from '../../../domain/repositories/reward-plan.repository.port';
import { getRewardPlanSchema, RewardPlanDocument } from './reward-plan.repository.schema';
import { mapPlanBenefitSubdocToDomain } from './subdoc/plan-benefit.subdoc';

@Repository('RewardPlan', getRewardPlanSchema())
class RewardPlanRepositoryAdapter
  extends BaseRepository<RewardPlanDocument, RewardPlan, CreateRewardPlan, UpdateRewardPlan>
  implements RewardPlanRepositoryPort
{
  protected toObject(document: RewardPlanDocument): RewardPlan {
    return {
      id: document._id.toHexString(),
      name: document.name,
      benefits: document.benefits.map((benefit) => mapPlanBenefitSubdocToDomain(benefit)),
      rewardLevel: document.rewardLevel,
    };
  }
}

export { RewardPlanRepositoryAdapter };
