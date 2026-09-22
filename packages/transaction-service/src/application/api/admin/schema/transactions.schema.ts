import { DocumentNode, gql } from '@neofinancial/neo-framework';

const getTransactionsSchema = (): DocumentNode => gql`
  enum TransactionRelativeQueryValueType {
    STRING
    NUMBER
    DATE
    OBJECT_ID
    BOOLEAN
    NULL
  }

  enum TransactionRelativeQuerySortDirection {
    ASC
    DESC
  }

  enum TransactionRelativeQueryFilterOperator {
    EQ
    NE
    LT
    LTE
    IN
    NIN
    GT
    GTE
  }

  input TransactionRelativeQueryFilterInput {
    field: String!
    type: TransactionRelativeQueryValueType!
    value: String
    values: [String!]
    operator: TransactionRelativeQueryFilterOperator!
  }

  input TransactionRelativeQuerySortInput {
    field: String!
    direction: TransactionRelativeQuerySortDirection!
  }

  input TransactionRelativeQueryCursorInput {
    field: String!
    type: TransactionRelativeQueryValueType!
    sort: TransactionRelativeQuerySortDirection!
    cursor: String
  }

  input TransactionRelativeQueryInput {
    filter: [TransactionRelativeQueryFilterInput!]
    primaryCursor: TransactionRelativeQueryCursorInput!
    secondaryCursor: TransactionRelativeQueryCursorInput
    limit: Int
  }

  type TransactionRelativeQueryCursor {
    field: String!
    type: TransactionRelativeQueryValueType!
    sort: TransactionRelativeQuerySortDirection!
    cursor: String
  }

  type TransactionList {
    results: [Transaction!]!
    hasNextPage: Boolean!
    primaryCursor: TransactionRelativeQueryCursor!
    secondaryCursor: TransactionRelativeQueryCursor
  }
`;

export { getTransactionsSchema };
