import {
  AdminContext,
  AdminResolver,
  AuthorizationRole,
  prepareRelativeCursorQueryInputForProvider,
  RelativeQueryFilterOperator,
  RelativeQueryValueType,
  Resolver,
} from '@neofinancial/neo-framework';

import { TransactionProviderPort } from '../../../../domain/providers/transactions/transaction.provider.port';
import { ProviderTokens } from '../../../../lib/provider-tokens';
import { inject } from '../../../../lib/strict-inject';
import { TransactionList, User, UserTransactionsArgs } from '../../types/schema';

@Resolver
class TransactionsResolver extends AdminResolver<TransactionList, User, UserTransactionsArgs> {
  constructor(
    @inject(ProviderTokens.TransactionProvider)
    private transactionProvider: TransactionProviderPort,
  ) {
    super({
      requiredAuthRoles: [AuthorizationRole.CUSTOMER_OPS],
      parentType: 'User',
      field: 'transactions',
    });
  }

  async resolver(user: User, args: UserTransactionsArgs, _context: AdminContext): Promise<TransactionList> {
    const query = prepareRelativeCursorQueryInputForProvider(args.input);

    query.filter?.push({
      field: 'userId',
      type: RelativeQueryValueType.OBJECT_ID,
      operator: RelativeQueryFilterOperator.EQ,
      value: user.id,
    });

    return this.transactionProvider.getTransactions(query);
  }
}

export { TransactionsResolver };
