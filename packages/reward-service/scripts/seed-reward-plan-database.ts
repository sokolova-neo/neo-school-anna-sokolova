import { connect, Mongoose, ObjectId, syncLogger } from '@neofinancial/neo-framework';

import { getDependencyRegistryInstance } from '../src/configuration/dependency-registry';
import { RewardPlanRepositoryPort } from '../src/domain/repositories/reward-plan.repository.port';
import { RepositoryTokens } from '../src/lib/repository-tokens';
import { RewardLevel, RewardPlan } from '../src/domain/entities/reward-plan/reward-plan';
import { TransactionCategory } from '../src/domain/entities/transaction';

const seedRewardPlans = async (): Promise<void> => {
  syncLogger.info('Seeding reward plans');

  const dependencyRegistry = getDependencyRegistryInstance();
  const mongoose = dependencyRegistry.resolve(Mongoose);

  await connect(mongoose);

  const rewardPlanRepository: RewardPlanRepositoryPort = dependencyRegistry.resolve(
    RepositoryTokens.RewardPlanRepository,
  );

  const plans: RewardPlan[] = [
    {
      id: new ObjectId().toHexString(),
      name: 'Bronze Rewards',
      rewardLevel: RewardLevel.BRONZE,
      benefits: [
        {
          category: TransactionCategory.GROCERY,
          rewardBoost: 0.01,
        },
      ],
    },
    {
      id: new ObjectId().toHexString(),
      name: 'Silver Rewards',
      rewardLevel: RewardLevel.SILVER,
      benefits: [
        {
          category: TransactionCategory.GROCERY,
          rewardBoost: 0.05,
        },
        {
          category: TransactionCategory.FOOD,
          rewardBoost: 0.03,
        },
      ],
    },
    {
      id: new ObjectId().toHexString(),
      name: 'Gold Rewards',
      rewardLevel: RewardLevel.GOLD,
      benefits: [
        {
          category: TransactionCategory.GROCERY,
          rewardBoost: 0.1,
        },
        {
          category: TransactionCategory.FOOD,
          rewardBoost: 0.08,
        },
        {
          category: TransactionCategory.ENTERTAINMENT,
          rewardBoost: 0.05,
        },
      ],
    },
    {
      id: new ObjectId().toHexString(),
      name: 'Platinum Rewards',
      rewardLevel: RewardLevel.PLATINUM,
      benefits: [
        {
          category: TransactionCategory.GROCERY,
          rewardBoost: 0.2,
        },
        {
          category: TransactionCategory.FOOD,
          rewardBoost: 0.15,
        },
        {
          category: TransactionCategory.ENTERTAINMENT,
          rewardBoost: 0.12,
        },
        {
          category: TransactionCategory.TRAVEL,
          rewardBoost: 0.1,
        },
      ],
    },
    {
      id: new ObjectId().toHexString(),
      name: 'Diamond Rewards',
      rewardLevel: RewardLevel.DIAMOND,
      benefits: [
        {
          category: TransactionCategory.GROCERY,
          rewardBoost: 0.5,
        },
        {
          category: TransactionCategory.FOOD,
          rewardBoost: 0.4,
        },
        {
          category: TransactionCategory.ENTERTAINMENT,
          rewardBoost: 0.3,
        },
        {
          category: TransactionCategory.TRAVEL,
          rewardBoost: 0.25,
        },
      ],
    },
  ];

  syncLogger.info('Plans', { plans });

  await Promise.allSettled(
    plans.map(async (plan) => {
      await rewardPlanRepository.create(plan);

      syncLogger.info(`Created plan: ${plan.name}`);
    }),
  );

  syncLogger.info('Seeding reward plans complete!');

  process.exit(0);
};

void seedRewardPlans();
