import { connect, Mongoose } from '@neofinancial/neo-framework';

import { getDependencyRegistryInstance } from '../../../../src/configuration/dependency-registry';
import { RewardPlanRepositoryPort } from '../../../../src/domain/repositories/reward-plan.repository.port';
import { RepositoryTokens } from '../../../../src/lib/repository-tokens';
import { rewardPlanFactory } from '../../../factories/reward-plan/reward-plan.factory';

describe('RewardPlanRepositoryAdapter', () => {
  const dependencyRegistry = getDependencyRegistryInstance();

  let db: Mongoose;
  let repository: RewardPlanRepositoryPort;

  beforeAll(async () => {
    db = await connect(dependencyRegistry.resolve(Mongoose));
    repository = dependencyRegistry.resolve(RepositoryTokens.RewardPlanRepository);
  });

  afterEach(async () => {
    await db.connection.dropDatabase();
  });

  afterAll(async () => {
    dependencyRegistry.container.clearInstances();
    await db.disconnect();
  });

  describe('toObject', () => {
    test('should transform document to domain object', async () => {
      const mockRewardPlan = rewardPlanFactory.build();
      const result = await repository.create(mockRewardPlan);

      expect(result).toEqual(mockRewardPlan);
    });
  });
});
