import {
  AdminTestClient,
  adminTestContext,
  createTestSchema,
  gql,
  RelativeQueryFilterOperator,
  RelativeQuerySortDirection,
  RelativeQueryValueType,
  vstub,
} from '@neofinancial/neo-framework';

import { getDependencyRegistryInstance } from '../../../../../src/configuration/dependency-registry';
import { TransactionProviderPort } from '../../../../../src/domain/providers/transactions/transaction.provider.port';
import { ProviderTokens } from '../../../../../src/lib/provider-tokens';
import { getTypeDefs } from '../../../../../src/application/api/admin/schema';
import getResolvers from '../../../../../src/application/api/admin/resolvers';
import { replicatedUserFactory } from '../../../../factories/replicated-user/replicated-user.factory';
import { transactionListFactory } from '../../../../factories/transaction/transaction-list.factory';
import { TransactionRelativeQueryInput } from '../../../../../src/application/api/types/schema';

describe('TransactionsResolver', () => {
  const stubTransactionProvider = vstub<TransactionProviderPort>();
  const dependencyRegistry = getDependencyRegistryInstance();
  let client: AdminTestClient;

  beforeAll(() => {
    dependencyRegistry.registerInstance(ProviderTokens.TransactionProvider, stubTransactionProvider);
  });

  const mockUser = replicatedUserFactory.build();

  beforeEach(() => {
    const stubUserResolver = {
      Query: {
        user: () => ({ id: mockUser.id }),
      },
    };

    const resolvers = [getResolvers(), stubUserResolver];
    const typeDefs = gql`
      ${getTypeDefs()}

      extend type Query {
        user: User
      }
    `;

    client = new AdminTestClient(createTestSchema(typeDefs, resolvers), adminTestContext);
  });

  describe('resolver', () => {
    const transactionsQuery = gql`
      query Transactions($userId: ObjectID!, $query: TransactionRelativeQueryInput!) {
        user(id: $userId) {
          transactions(input: $query) {
            results {
              id
              amountCents
              status
              category
              transactionDate
            }
            hasNextPage
            primaryCursor {
              cursor
            }
          }
        }
      }
    `;

    const mockQueryInput: TransactionRelativeQueryInput = {
      filter: [],
      limit: 10,
      primaryCursor: {
        field: 'Soccer Field',
        sort: RelativeQuerySortDirection.ASC,
        type: RelativeQueryValueType.STRING,
      },
    };

    it('should return a transaction list', async () => {
      const mockTransactionList = transactionListFactory.build();

      stubTransactionProvider.getTransactions.mockResolvedValueOnce(mockTransactionList);

      const result = await client.query({
        query: transactionsQuery,
        variables: {
          userId: mockUser.id,
          query: mockQueryInput,
        },
      });

      expect(result.data).toEqual({
        user: {
          __typename: 'User',
          transactions: {
            __typename: 'TransactionList',
            hasNextPage: mockTransactionList.hasNextPage,
            primaryCursor: {
              __typename: 'TransactionRelativeQueryCursor',
              cursor: mockTransactionList.primaryCursor.cursor,
            },
            results: mockTransactionList.results.map((result) => ({
              __typename: 'Transaction',
              id: result.id,
              amountCents: result.amountCents,
              status: result.status,
              category: result.category,
              transactionDate: result.transactionDate.toISOString(),
            })),
          },
        },
      });
    });

    it('should call transactionProvider.getTransactions', async () => {
      const mockTransactionList = transactionListFactory.build();

      stubTransactionProvider.getTransactions.mockResolvedValueOnce(mockTransactionList);

      await client.query({
        query: transactionsQuery,
        variables: {
          userId: mockUser.id,
          query: mockQueryInput,
        },
      });

      expect(stubTransactionProvider.getTransactions).toHaveBeenCalledOnce();
      expect(stubTransactionProvider.getTransactions).toHaveBeenCalledWith({
        ...mockQueryInput,
        filter: [
          {
            field: 'userId',
            operator: RelativeQueryFilterOperator.EQ,
            type: RelativeQueryValueType.OBJECT_ID,
            value: mockUser.id,
          },
        ],
        secondaryCursor: undefined,
      });
    });
  });
});
