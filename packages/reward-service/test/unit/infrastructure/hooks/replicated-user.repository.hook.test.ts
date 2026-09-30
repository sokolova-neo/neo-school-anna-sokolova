import { vstub } from '@neofinancial/neo-framework';

import { RewardLevel } from '../../../../src/domain/entities/reward-plan/reward-plan';
import { RewardAccountRepositoryPort } from '../../../../src/domain/repositories/reward-account.port';
import { RewardPlanRepositoryPort } from '../../../../src/domain/repositories/reward-plan.repository.port';
import { ReplicatedUserRepositoryHook } from '../../../../src/infrastructure/repositories/replicated-user/replicated-user.repository.hook';
import { replicatedUserFactory } from '../../../factories/replicated-user/replicated-user.factory';
import { rewardPlanFactory } from '../../../factories/reward-plan/reward-plan.factory';

describe('ReplicatedUserRepositoryHook', () => {
  const stubRewardAccountRepository = vstub<RewardAccountRepositoryPort>();
  const stubRewardPlanRepository = vstub<RewardPlanRepositoryPort>();
  const hook = new ReplicatedUserRepositoryHook(stubRewardAccountRepository, stubRewardPlanRepository);

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('onCreate', () => {
    const freshlyReplicatedUser = replicatedUserFactory.build();
    const bronzePlan = rewardPlanFactory.build({ rewardLevel: RewardLevel.BRONZE });

    it('should look up the BRONZE reward plan', async () => {
      stubRewardPlanRepository.findOneByFields.mockResolvedValueOnce(bronzePlan);
      stubRewardAccountRepository.create.mockResolvedValueOnce({
        id: 'account-id',
        userId: freshlyReplicatedUser.id,
        rewardPlanId: bronzePlan.id,
      });

      await hook.onCreate(freshlyReplicatedUser);

      expect(stubRewardPlanRepository.findOneByFields).toHaveBeenCalledWith({
        rewardLevel: RewardLevel.BRONZE,
      });
    });

    it('should create a reward account for the user with the BRONZE plan', async () => {
      stubRewardPlanRepository.findOneByFields.mockResolvedValueOnce(bronzePlan);
      stubRewardAccountRepository.create.mockResolvedValueOnce({
        id: 'account-id',
        userId: freshlyReplicatedUser.id,
        rewardPlanId: bronzePlan.id,
      });

      await hook.onCreate(freshlyReplicatedUser);

      expect(stubRewardAccountRepository.create).toHaveBeenCalledOnce();
      expect(stubRewardAccountRepository.create).toHaveBeenCalledWith({
        rewardPlanId: bronzePlan.id,
        userId: freshlyReplicatedUser.id,
      });
    });

    it('should not create a reward account when no BRONZE plan exists', async () => {
      stubRewardPlanRepository.findOneByFields.mockResolvedValueOnce(undefined);

      await hook.onCreate(freshlyReplicatedUser);

      expect(stubRewardAccountRepository.create).not.toHaveBeenCalled();
    });
  });
});
