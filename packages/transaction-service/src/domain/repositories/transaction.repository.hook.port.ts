import { OnCreateCallbackPartial } from '@neofinancial/neo-framework';

import { Transaction } from '../entities/transaction/transaction';

export interface TransactionRepositoryHookPort extends OnCreateCallbackPartial<Transaction> {}
