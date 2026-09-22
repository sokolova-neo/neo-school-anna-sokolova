import { DocumentNode, gql } from '@neofinancial/neo-framework';

const getRewardPlansSchema = (): DocumentNode => gql`
  enum RewardPlanRelativeQueryValueType {
    STRING
    NUMBER
    DATE
    OBJECT_ID
    BOOLEAN
    NULL
  }

  enum RewardPlanRelativeQuerySortDirection {
    ASC
    DESC
  }

  enum RewardPlanRelativeQueryFilterOperator {
    EQ
    NE
    LT
    LTE
    IN
    NIN
    GT
    GTE
  }

  input RewardPlanRelativeQueryFilterInput {
    field: String!
    type: RewardPlanRelativeQueryValueType!
    value: String
    values: [String!]
    operator: RewardPlanRelativeQueryFilterOperator!
  }

  input RewardPlanRelativeQuerySortInput {
    field: String!
    direction: RewardPlanRelativeQuerySortDirection!
  }

  input RewardPlanRelativeQueryCursorInput {
    field: String!
    type: RewardPlanRelativeQueryValueType!
    sort: RewardPlanRelativeQuerySortDirection!
    cursor: String
  }

  input RewardPlanRelativeQueryInput {
    filter: [RewardPlanRelativeQueryFilterInput!]
    primaryCursor: RewardPlanRelativeQueryCursorInput!
    secondaryCursor: RewardPlanRelativeQueryCursorInput
    limit: Int
  }

  type RewardPlanRelativeQueryCursor {
    field: String!
    type: RewardPlanRelativeQueryValueType!
    sort: RewardPlanRelativeQuerySortDirection!
    cursor: String
  }

  type RewardPlanList {
    results: [RewardPlan!]!
    hasNextPage: Boolean!
    primaryCursor: RewardPlanRelativeQueryCursor
    secondaryCursor: RewardPlanRelativeQueryCursor
  }

  extend type Query {
    rewardPlans(input: RewardPlanRelativeQueryInput!): RewardPlanList!
  }
`;

export { getRewardPlansSchema };
