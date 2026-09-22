export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: Date; output: Date };
  DateTime: { input: Date; output: Date };
  Long: { input: number; output: number };
  ObjectID: { input: string; output: string };
};

export type PlanBenefit = {
  __typename?: 'PlanBenefit';
  category: PlanBenefitTransactionCategory;
  rewardBoost: Scalars['Float']['output'];
};

export type PlanBenefitTransactionCategory = 'ENTERTAINMENT' | 'FOOD' | 'GROCERY' | 'TRAVEL';

export type Query = {
  __typename?: 'Query';
  rewardPlans: RewardPlanList;
};

export type QueryRewardPlansArgs = {
  input: RewardPlanRelativeQueryInput;
};

export type RewardLevel = 'BRONZE' | 'DIAMOND' | 'GOLD' | 'PLATINUM' | 'SILVER';

export type RewardPlan = {
  __typename?: 'RewardPlan';
  benefits: Array<PlanBenefit>;
  id: Scalars['ObjectID']['output'];
  name: Scalars['String']['output'];
  rewardLevel: RewardLevel;
};

export type RewardPlanList = {
  __typename?: 'RewardPlanList';
  hasNextPage: Scalars['Boolean']['output'];
  primaryCursor?: Maybe<RewardPlanRelativeQueryCursor>;
  results: Array<RewardPlan>;
  secondaryCursor?: Maybe<RewardPlanRelativeQueryCursor>;
};

export type RewardPlanRelativeQueryCursor = {
  __typename?: 'RewardPlanRelativeQueryCursor';
  cursor?: Maybe<Scalars['String']['output']>;
  field: Scalars['String']['output'];
  sort: RewardPlanRelativeQuerySortDirection;
  type: RewardPlanRelativeQueryValueType;
};

export type RewardPlanRelativeQueryCursorInput = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  field: Scalars['String']['input'];
  sort: RewardPlanRelativeQuerySortDirection;
  type: RewardPlanRelativeQueryValueType;
};

export type RewardPlanRelativeQueryFilterInput = {
  field: Scalars['String']['input'];
  operator: RewardPlanRelativeQueryFilterOperator;
  type: RewardPlanRelativeQueryValueType;
  value?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type RewardPlanRelativeQueryFilterOperator = 'EQ' | 'GT' | 'GTE' | 'IN' | 'LT' | 'LTE' | 'NE' | 'NIN';

export type RewardPlanRelativeQueryInput = {
  filter?: InputMaybe<Array<RewardPlanRelativeQueryFilterInput>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  primaryCursor: RewardPlanRelativeQueryCursorInput;
  secondaryCursor?: InputMaybe<RewardPlanRelativeQueryCursorInput>;
};

export type RewardPlanRelativeQuerySortDirection = 'ASC' | 'DESC';

export type RewardPlanRelativeQuerySortInput = {
  direction: RewardPlanRelativeQuerySortDirection;
  field: Scalars['String']['input'];
};

export type RewardPlanRelativeQueryValueType = 'BOOLEAN' | 'DATE' | 'NULL' | 'NUMBER' | 'OBJECT_ID' | 'STRING';

export type User = {
  __typename?: 'User';
  id: Scalars['ObjectID']['output'];
};
