import { RelativeCursorInput, RelativeCursorResultList } from '@neofinancial/neo-framework';

import { RewardPlan } from '../../entities/reward-plan/reward-plan';

export interface RewardPlanProviderPort {
  getRewardPlansByRelativeCursorQuery: (input: RelativeCursorInput) => Promise<RelativeCursorResultList<RewardPlan>>;
}
