import { TransactionCategory } from '../transaction';

export interface RewardPlan {
  id: string;
  name: string;
  rewardLevel: RewardLevel;
  benefits: PlanBenefit[];
}

export interface PlanBenefit {
  category: TransactionCategory;
  rewardBoost: number;
}

export enum RewardLevel {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND',
}
