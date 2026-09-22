import { DocumentNode, gql } from '@neofinancial/neo-framework';

const getRewardPlanSchema = (): DocumentNode => gql`
  type RewardPlan {
    id: ObjectID!
    name: String!
    rewardLevel: RewardLevel!
    benefits: [PlanBenefit!]!
  }

  type PlanBenefit {
    category: PlanBenefitTransactionCategory!
    rewardBoost: Float!
  }

  enum RewardLevel {
    BRONZE
    SILVER
    GOLD
    PLATINUM
    DIAMOND
  }

  enum PlanBenefitTransactionCategory {
    GROCERY
    ENTERTAINMENT
    TRAVEL
    FOOD
  }
`;

export { getRewardPlanSchema };
