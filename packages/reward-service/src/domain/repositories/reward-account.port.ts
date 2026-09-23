import { BaseRepositoryPort } from '@neofinancial/neo-framework';

import { RewardAccount } from '../entities/reward-account/reward-account';

export type CreateRewardAccount = Omit<RewardAccount, 'id'>;

export type UpdateRewardAccount = Partial<Pick<RewardAccount, 'rewardPlanId'>>;


export interface RewardAccountRepositoryPort
  extends Pick<
    BaseRepositoryPort<RewardAccount, CreateRewardAccount, UpdateRewardAccount >,
    'create' | 'findOneByFields'
  > {}
