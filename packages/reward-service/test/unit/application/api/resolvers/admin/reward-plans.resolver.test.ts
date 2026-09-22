import { AdminTestClient, adminTestContext, gql, vstub } from '@neofinancial/neo-framework';

import { getSchema } from '../../../../../../src/application/api/admin/schema';
import { RewardPlanRelativeQueryInput } from '../../../../../../src/application/api/types/schema';
import { getDependencyRegistryInstance } from '../../../../../../src/configuration/dependency-registry';
import { RewardPlanProviderPort } from '../../../../../../src/domain/providers/reward-plan/reward-plan.provider.port';
import { ProviderTokens } from '../../../../../../src/lib/provider-tokens';
import {
  rewardPlanRelativeCursorQueryInputFactory,
  rewardPlanRelativeCursorResultListFactory,
} from '../../../../../factories/reward-plan/reward-plan-relative-cursor-query.factory';

describe('RewardPlansResolver', () => {
  const dependencyRegistry = getDependencyRegistryInstance();
  const stubRewardPlanProvider = vstub<RewardPlanProviderPort>();
  let client: AdminTestClient;

  const setupDependencies = () => {
    dependencyRegistry.registerInstance(ProviderTokens.RewardPlanProvider, stubRewardPlanProvider);
    client = new AdminTestClient(getSchema(), adminTestContext);
  };

  beforeAll(() => {
    setupDependencies();
  });

  const query = gql`
    query TestRewardPlansQuery($input: RewardPlanRelativeQueryInput!) {
      rewardPlans(input: $input) {
        results {
          id
          name
          rewardLevel
          benefits {
            category
            rewardBoost
          }
        }
        hasNextPage
        primaryCursor {
          cursor
        }
      }
    }
  `;

  describe('resolver', () => {
    const mockQueryInput: RewardPlanRelativeQueryInput = rewardPlanRelativeCursorQueryInputFactory.build();
    const mockQueryResult = rewardPlanRelativeCursorResultListFactory.build();

    beforeEach(() => {
      stubRewardPlanProvider.getRewardPlansByRelativeCursorQuery.mockResolvedValueOnce(mockQueryResult);
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    it('should return a relative cursor result list', async () => {
      const result = await client.query({ query, variables: { input: mockQueryInput } });

      expect(result.data).toEqual({
        rewardPlans: {
          __typename: 'RewardPlanList',
          hasNextPage: mockQueryResult.hasNextPage,
          primaryCursor: {
            __typename: 'RewardPlanRelativeQueryCursor',
            cursor: mockQueryResult.primaryCursor.cursor,
          },
          results: mockQueryResult.results.map((rewardPlan) => ({
            __typename: 'RewardPlan',
            id: rewardPlan.id,
            name: rewardPlan.name,
            rewardLevel: rewardPlan.rewardLevel,
            benefits: rewardPlan.benefits.map((benefit) => ({
              ...benefit,
              __typename: 'PlanBenefit',
            })),
          })),
        },
      });
    });

    it('should call rewardPlanProvider.getRewardPlansByRelativeCursorQuery', async () => {
      await client.query({ query, variables: { input: mockQueryInput } });

      expect(stubRewardPlanProvider.getRewardPlansByRelativeCursorQuery).toHaveBeenCalledOnce();
      expect(stubRewardPlanProvider.getRewardPlansByRelativeCursorQuery).toHaveBeenCalledWith(mockQueryInput);
    });
  });
});
