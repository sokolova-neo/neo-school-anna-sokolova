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

export type Mutation = {
  __typename?: 'Mutation';
  updateUserContact: UpdateUserContactResponse;
  updateUserDetails: UpdateUserDetailsResponse;
};

export type MutationUpdateUserContactArgs = {
  input: UpdateUserContactInput;
};

export type MutationUpdateUserDetailsArgs = {
  input: UpdateUserDetailsInput;
};

export type Province = 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'NT' | 'NU' | 'ON' | 'PE' | 'QC' | 'SK' | 'YT';

export type Query = {
  __typename?: 'Query';
  user: User;
  users: UserList;
};

export type QueryUserArgs = {
  id: Scalars['ObjectID']['input'];
};

export type QueryUsersArgs = {
  input: UserRelativeQueryInput;
};

export type UpdateUserContactInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ObjectID']['input'];
};

export type UpdateUserContactResponse = {
  __typename?: 'UpdateUserContactResponse';
  user: User;
};

export type UpdateUserDetailsInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  preferredName?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Province>;
  userId: Scalars['ObjectID']['input'];
};

export type UpdateUserDetailsResponse = {
  __typename?: 'UpdateUserDetailsResponse';
  user: User;
};

export type User = {
  __typename?: 'User';
  dateOfBirth: Scalars['Date']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ObjectID']['output'];
  lastName: Scalars['String']['output'];
  phone: Scalars['String']['output'];
  preferredName?: Maybe<Scalars['String']['output']>;
  province: Province;
  status: UserStatus;
};

export type UserList = {
  __typename?: 'UserList';
  hasNextPage: Scalars['Boolean']['output'];
  primaryCursor?: Maybe<UserRelativeQueryCursor>;
  results: Array<User>;
  secondaryCursor?: Maybe<UserRelativeQueryCursor>;
};

export type UserRelativeQueryCursor = {
  __typename?: 'UserRelativeQueryCursor';
  cursor?: Maybe<Scalars['String']['output']>;
  field: Scalars['String']['output'];
  sort: UserRelativeQuerySortDirection;
  type: UserRelativeQueryValueType;
};

export type UserRelativeQueryCursorInput = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  field: Scalars['String']['input'];
  sort: UserRelativeQuerySortDirection;
  type: UserRelativeQueryValueType;
};

export type UserRelativeQueryFilterInput = {
  field: Scalars['String']['input'];
  operator: UserRelativeQueryFilterOperator;
  type: UserRelativeQueryValueType;
  value?: InputMaybe<Scalars['String']['input']>;
  values?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UserRelativeQueryFilterOperator = 'EQ' | 'GT' | 'GTE' | 'IN' | 'LT' | 'LTE' | 'NE' | 'NIN';

export type UserRelativeQueryInput = {
  filter?: InputMaybe<Array<UserRelativeQueryFilterInput>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  primaryCursor: UserRelativeQueryCursorInput;
  secondaryCursor?: InputMaybe<UserRelativeQueryCursorInput>;
};

export type UserRelativeQuerySortDirection = 'ASC' | 'DESC';

export type UserRelativeQuerySortInput = {
  direction: UserRelativeQuerySortDirection;
  field: Scalars['String']['input'];
};

export type UserRelativeQueryValueType = 'BOOLEAN' | 'DATE' | 'NULL' | 'NUMBER' | 'OBJECT_ID' | 'STRING';

export type UserStatus = 'ACTIVE' | 'FROZEN' | 'INACTIVE' | 'PENDING';
