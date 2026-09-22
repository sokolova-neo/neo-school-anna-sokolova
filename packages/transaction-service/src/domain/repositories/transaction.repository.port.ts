import { BaseObservableRepositoryPort } from '@neofinancial/neo-framework';

import { Transaction } from '../entities/transaction/transaction';

export type CreateTransaction = Omit<Transaction, 'id'>;

export type UpdateTransaction = never;

export interface TransactionRepositoryPort
  extends Pick<
    BaseObservableRepositoryPort<Transaction, CreateTransaction, UpdateTransaction>,
    'create' | 'findByRelativeCursorQuery' | 'findOneByFields'
  > {
  getOrCreateOneByExternalId(externalId: string, input: CreateTransaction): Promise<Transaction>;
}
