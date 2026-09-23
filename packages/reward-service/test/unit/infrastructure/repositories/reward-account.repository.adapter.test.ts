import { connect, Mongoose } from '@neofinancial/neo-framework';

import { getDependencyRegistryInstance } from '../../../../src/configuration/dependency-registry';
import { RewardAccountRepositoryPort } from '../../../../src/domain/repositories/reward-account.port';
import { RepositoryTokens } from '../../../../src/lib/repository-tokens';
import { rewardAccountFactory } from '../../../factories/reward-account/reward-account.factory';

describe('RewardAccountRepositoryAdapter', () => {
  const dependencyRegistry = getDependencyRegistryInstance();

  let db: Mongoose;
  let repository: RewardAccountRepositoryPort;

  beforeAll(async () => {
    db = await connect(dependencyRegistry.resolve(Mongoose));
    repository = dependencyRegistry.resolve(RepositoryTokens.RewardAccountRepository);
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
      const mockRewardAccount = rewardAccountFactory.build();
      const result = await repository.create(mockRewardAccount);

      expect(result).toEqual(mockRewardAccount);
    });
  });
});
