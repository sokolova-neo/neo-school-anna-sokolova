import { BaseRepositoryPort } from '@neofinancial/neo-framework';

import { RewardPlan } from '../entities/reward-plan/reward-plan';

export type CreateRewardPlan = Omit<RewardPlan, 'id'>;

export type UpdateRewardPlan = Partial<Pick<RewardPlan, 'benefits' | 'name'>>;

export interface RewardPlanRepositoryPort
  extends Pick<
    BaseRepositoryPort<RewardPlan, CreateRewardPlan, UpdateRewardPlan>,
    'create' | 'findByRelativeCursorQuery' | 'findOneByFields'
  > {}
