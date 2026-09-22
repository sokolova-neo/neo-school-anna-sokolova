import { DocumentNode, gql } from '@neofinancial/neo-framework';

const getTransactionSchema = (): DocumentNode => gql`
  type Transaction {
    id: ObjectID!
    amountCents: Long!
    transactionDate: DateTime!
    status: TransactionStatus!
    category: TransactionCategory!
  }

  enum TransactionStatus {
    SUCCESS
    PENDING
    FAILED
  }

  enum TransactionCategory {
    GROCERY
    ENTERTAINMENT
    TRAVEL
    FOOD
  }
`;

export { getTransactionSchema };
