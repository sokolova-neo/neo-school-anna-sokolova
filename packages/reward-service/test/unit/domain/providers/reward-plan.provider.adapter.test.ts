import { vstub } from '@neofinancial/neo-framework';

import { getDependencyRegistryInstance } from '../../../../src/configuration/dependency-registry';
import { RewardPlanProviderPort } from '../../../../src/domain/providers/reward-plan/reward-plan.provider.port';
import { RewardPlanRepositoryPort } from '../../../../src/domain/repositories/reward-plan.repository.port';
import { ProviderTokens } from '../../../../src/lib/provider-tokens';
import { RepositoryTokens } from '../../../../src/lib/repository-tokens';
import {
  rewardPlanRelativeCursorQueryInputFactory,
  rewardPlanRelativeCursorResultListFactory,
} from '../../../factories/reward-plan/reward-plan-relative-cursor-query.factory';

describe('RewardPlanProviderAdapter', () => {
  const dependencyRegistry = getDependencyRegistryInstance();
  const stubRewardPlanRepository = vstub<RewardPlanRepositoryPort>();
  let provider: RewardPlanProviderPort;

  const setupDependencies = () => {
    dependencyRegistry.registerInstance(RepositoryTokens.RewardPlanRepository, stubRewardPlanRepository);

    provider = dependencyRegistry.resolve(ProviderTokens.RewardPlanProvider);
  };

  beforeAll(() => {
    setupDependencies();
  });

  afterAll(() => {
    dependencyRegistry.container.clearInstances();
  });

  describe('getRewardPlansByRelativeCursorQuery', () => {
    const mockInput = rewardPlanRelativeCursorQueryInputFactory.build();
    const mockResult = rewardPlanRelativeCursorResultListFactory.build();

    beforeEach(() => {
      stubRewardPlanRepository.findByRelativeCursorQuery.mockResolvedValueOnce(mockResult);
    });

    it('should return relative cursor query result list', async () => {
      const result = await provider.getRewardPlansByRelativeCursorQuery(mockInput);

      expect(result).toEqual(mockResult);
    });

    it('should call rewardPlanRepository.findByRelativeCursorQuery', async () => {
      await provider.getRewardPlansByRelativeCursorQuery(mockInput);

      expect(stubRewardPlanRepository.findByRelativeCursorQuery).toHaveBeenCalledOnce();
      expect(stubRewardPlanRepository.findByRelativeCursorQuery).toHaveBeenCalledWith(mockInput);
    });
  });
});
