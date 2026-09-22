import { DocumentNode, gql } from '@neofinancial/neo-framework';

const getUsersSchema = (): DocumentNode => gql`
  enum UserRelativeQueryValueType {
    STRING
    NUMBER
    DATE
    OBJECT_ID
    BOOLEAN
    NULL
  }

  enum UserRelativeQuerySortDirection {
    ASC
    DESC
  }

  enum UserRelativeQueryFilterOperator {
    EQ
    NE
    LT
    LTE
    IN
    NIN
    GT
    GTE
  }

  input UserRelativeQueryFilterInput {
    field: String!
    type: UserRelativeQueryValueType!
    value: String
    values: [String!]
    operator: UserRelativeQueryFilterOperator!
  }

  input UserRelativeQuerySortInput {
    field: String!
    direction: UserRelativeQuerySortDirection!
  }

  input UserRelativeQueryCursorInput {
    field: String!
    type: UserRelativeQueryValueType!
    sort: UserRelativeQuerySortDirection!
    cursor: String
  }

  input UserRelativeQueryInput {
    filter: [UserRelativeQueryFilterInput!]
    primaryCursor: UserRelativeQueryCursorInput!
    secondaryCursor: UserRelativeQueryCursorInput
    limit: Int
  }

  type UserRelativeQueryCursor {
    field: String!
    type: UserRelativeQueryValueType!
    sort: UserRelativeQuerySortDirection!
    cursor: String
  }

  type UserList {
    results: [User!]!
    hasNextPage: Boolean!
    primaryCursor: UserRelativeQueryCursor
    secondaryCursor: UserRelativeQueryCursor
  }

  extend type Query {
    users(input: UserRelativeQueryInput!): UserList!
  }
`;

export { getUsersSchema };
