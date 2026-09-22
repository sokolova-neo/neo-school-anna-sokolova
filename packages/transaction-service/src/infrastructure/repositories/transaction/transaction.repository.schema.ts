import { Document, getLongAsNumber, ObjectId, Schema } from '@neofinancial/neo-framework';

import { Transaction, TransactionCategory, TransactionStatus } from '../../../domain/entities/transaction/transaction';

export interface TransactionDocument extends Document, Omit<Transaction, 'id' | 'userId'> {
  userId: ObjectId;
}

const getTransactionSchema = (): Schema => {
  const schema = new Schema({
    externalId: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    amountCents: {
      type: BigInt,
      get: getLongAsNumber,
      required: true,
    },
    transactionDate: {
      type: Schema.Types.Date,
      required: true,
    },
    status: {
      type: Schema.Types.String,
      required: true,
      enum: Object.values(TransactionStatus),
    },
    category: {
      type: Schema.Types.String,
      required: true,
      enum: Object.values(TransactionCategory),
    },
  });

  schema.index({ userId: -1, transactionDate: -1 });
  schema.index({ transactionDate: -1, _id: -1 });

  return schema;
};

export { getTransactionSchema };
