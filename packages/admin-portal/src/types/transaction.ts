export interface Transaction {
  id: string;
  amountCents: number;
  transactionDate: Date;
  status: TransactionStatus;
  category: TransactionCategory;
}

export enum TransactionCategory {
  GROCERY = 'GROCERY',
  ENTERTAINMENT = 'ENTERTAINMENT',
  TRAVEL = 'TRAVEL',
  FOOD = 'FOOD',
}

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}
