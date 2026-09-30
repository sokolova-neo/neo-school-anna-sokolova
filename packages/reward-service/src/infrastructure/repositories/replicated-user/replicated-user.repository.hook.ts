import { asyncLogger as logger, OnCreateCallbackPartial, RepositoryHook } from '@neofinancial/neo-framework';

import { ReplicatedUser } from '../../../domain/entities/replicated-user/replicated-user';
import { RewardAccountRepositoryPort } from '../../../domain/repositories/reward-account.port';
import {RewardPlanRepositoryPort} from '../../../domain/repositories/reward-plan.repository.port';
import { RepositoryTokens } from '../../../lib/repository-tokens';
import { inject } from '../../../lib/strict-inject';
import { RewardLevel } from '../../../domain/entities/reward-plan/reward-plan';

@RepositoryHook
class ReplicatedUserRepositoryHook implements OnCreateCallbackPartial<ReplicatedUser> {
  constructor(
    @inject(RepositoryTokens.RewardAccountRepository)
    @inject(RepositoryTokens.RewardPlanRepository)
    
    private rewardAccountRepository: RewardAccountRepositoryPort,
    private rewardPlanRepository: RewardPlanRepositoryPort
  ) {}

  public onCreate = async (freshlyReplicatedUser: ReplicatedUser): Promise<void> => {
   
    const rewardPlan = await this.rewardPlanRepository.findOneByFields({ rewardLevel: RewardLevel.BRONZE });
   
    if(!rewardPlan) {
      logger.debug('No BRONZE reward plan found', {
        logData: {
          freshlyReplicatedUser,
        },
      });

      return;
    }

    await this.rewardAccountRepository.create({
      rewardPlanId: rewardPlan.id,
      userId: freshlyReplicatedUser.id,
    });
  };
}

export { ReplicatedUserRepositoryHook };
