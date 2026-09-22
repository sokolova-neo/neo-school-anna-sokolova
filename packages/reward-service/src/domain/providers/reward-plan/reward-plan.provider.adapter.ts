import { Provider, RelativeCursorInput, RelativeCursorResultList } from '@neofinancial/neo-framework';

import { RepositoryTokens } from '../../../lib/repository-tokens';
import { inject } from '../../../lib/strict-inject';

import { RewardPlan } from '../../entities/reward-plan/reward-plan';
import { RewardPlanRepositoryPort } from '../../repositories/reward-plan.repository.port';
import { RewardPlanProviderPort } from './reward-plan.provider.port';

@Provider
class RewardPlanProviderAdapter implements RewardPlanProviderPort {
  constructor(@inject(RepositoryTokens.RewardPlanRepository) private rewardPlanRepository: RewardPlanRepositoryPort) {}

  public async getRewardPlansByRelativeCursorQuery(
    input: RelativeCursorInput,
  ): Promise<RelativeCursorResultList<RewardPlan>> {
    const result = await this.rewardPlanRepository.findByRelativeCursorQuery(input);

    return result;
  }
}

export { RewardPlanProviderAdapter };
