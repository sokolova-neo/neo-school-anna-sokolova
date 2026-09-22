import {
  AdminContext,
  AdminQueryResolver,
  AuthorizationRole,
  prepareRelativeCursorQueryInputForProvider,
  Resolver,
  Root,
} from '@neofinancial/neo-framework';

import { inject } from '../../../../lib/strict-inject';
import { ProviderTokens } from '../../../../lib/provider-tokens';

import { RewardPlanProviderPort } from '../../../../domain/providers/reward-plan/reward-plan.provider.port';
import { QueryRewardPlansArgs, RewardPlanList } from '../../types/schema';

@Resolver
class RewardPlansResolver extends AdminQueryResolver<RewardPlanList> {
  constructor(@inject(ProviderTokens.RewardPlanProvider) private rewardPlanProvider: RewardPlanProviderPort) {
    super({
      requiredAuthRoles: [AuthorizationRole.CUSTOMER_OPS],
      field: 'rewardPlans',
    });
  }

  async resolver(_: Root, args: QueryRewardPlansArgs, _context: AdminContext): Promise<RewardPlanList> {
    const query = prepareRelativeCursorQueryInputForProvider(args.input);
    const result = await this.rewardPlanProvider.getRewardPlansByRelativeCursorQuery(query);

    return result;
  }
}

export { RewardPlansResolver };
