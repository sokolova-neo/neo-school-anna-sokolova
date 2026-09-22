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

export type Transaction = {
  __typename?: 'Transaction';
  amountCents: Scalars['Long']['output'];
  category: TransactionCategory;
  id: Scalars['ObjectID']['output'];
  status: TransactionStatus;
  transactionDate: Scalars['DateTime']['output'];
};

export type TransactionCategory = 'ENTERTAINMENT' | 'FOOD' | 'GROCERY' | 'TRAVEL';

export type TransactionList = {
  __typename?: 'TransactionList';
  hasNextPage: Scalars['Boolean']['output'];
  primaryCursor: TransactionRelativeQueryCursor;
  results: Array<Transaction>;
  secondaryCursor?: Maybe<TransactionRelativeQueryCursor>;
};

export type TransactionRelativeQueryCursor = {
  __typename?: 'TransactionRelativeQueryCursor';
  cursor?: Maybe<Scalars['String']['output']>;
  field: Scalars['String']['output'];
  sort: TransactionRelativeQuerySortDirection;
  type: TransactionRelativeQueryValueType;
};

export type TransactionRelativeQueryCursorInput = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  field: Scalars['String']['input'];
  sort: TransactionRelativeQuerySortDirection;
  type: TransactionRelativeQueryValueType;
};

export type TransactionRelativeQueryFilterInput = {
  field: Scalars['String']['input'];
  operator: TransactionRelativeQueryFilterOperator;
  type: TransactionRelativeQueryValueType;
  value?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type TransactionRelativeQueryFilterOperator = 'EQ' | 'GT' | 'GTE' | 'IN' | 'LT' | 'LTE' | 'NE' | 'NIN';

export type TransactionRelativeQueryInput = {
  filter?: InputMaybe<Array<TransactionRelativeQueryFilterInput>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  primaryCursor: TransactionRelativeQueryCursorInput;
  secondaryCursor?: InputMaybe<TransactionRelativeQueryCursorInput>;
};

export type TransactionRelativeQuerySortDirection = 'ASC' | 'DESC';

export type TransactionRelativeQuerySortInput = {
  direction: TransactionRelativeQuerySortDirection;
  field: Scalars['String']['input'];
};

export type TransactionRelativeQueryValueType = 'BOOLEAN' | 'DATE' | 'NULL' | 'NUMBER' | 'OBJECT_ID' | 'STRING';

export type TransactionStatus = 'FAILED' | 'PENDING' | 'SUCCESS';

export type User = {
  __typename?: 'User';
  id: Scalars['ObjectID']['output'];
  transactions: TransactionList;
};

export type UserTransactionsArgs = {
  input: TransactionRelativeQueryInput;
};
