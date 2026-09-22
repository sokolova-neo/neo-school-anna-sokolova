import {
  AdminTestClient,
  adminTestContext,
  gql,
  RelativeQuerySortDirection,
  RelativeQueryValueType,
  vstub,
} from '@neofinancial/neo-framework';

import { getDependencyRegistryInstance } from '../../../../../src/configuration/dependency-registry';
import { UserProviderPort } from '../../../../../src/domain/providers/user/user.provider.port';
import { ProviderTokens } from '../../../../../src/lib/provider-tokens';
import { getSchema } from '../../../../../src/application/api/admin/schema';
import { userFactory } from '../../../../factories/user/user.factory';
import { userListFactory } from '../../../../factories/user/user-list.factory';
import { UserRelativeQueryInput } from '../../../../../src/application/api/types/schema';

describe('UsersResolver', () => {
  const stubUserProvider = vstub<UserProviderPort>();
  const dependencyRegistry = getDependencyRegistryInstance();
  let client: AdminTestClient;

  beforeAll(() => {
    dependencyRegistry.registerInstance(ProviderTokens.UserProvider, stubUserProvider);
  });

  const mockUser = userFactory.build();

  beforeEach(() => {
    client = new AdminTestClient(getSchema(), adminTestContext);
  });

  describe('resolver', () => {
    const usersQuery = gql`
      query Users($query: UserRelativeQueryInput!) {
        users(input: $query) {
          results {
            id
            firstName
            preferredName
            lastName
            email
            phone
            dateOfBirth
            status
            province
          }
          hasNextPage
          primaryCursor {
            cursor
          }
        }
      }
    `;

    const mockQueryInput: UserRelativeQueryInput = {
      filter: [],
      limit: 10,
      primaryCursor: {
        field: 'Soccer Field',
        sort: RelativeQuerySortDirection.ASC,
        type: RelativeQueryValueType.STRING,
      },
    };

    it('should return a user list', async () => {
      const mockUserList = userListFactory.build();

      stubUserProvider.getUsers.mockResolvedValueOnce(mockUserList);

      const result = await client.query({
        query: usersQuery,
        variables: {
          userId: mockUser.id,
          query: mockQueryInput,
        },
      });

      expect(result.data).toEqual({
        users: {
          __typename: 'UserList',
          hasNextPage: mockUserList.hasNextPage,
          primaryCursor: {
            __typename: 'UserRelativeQueryCursor',
            cursor: mockUserList.primaryCursor.cursor,
          },
          results: mockUserList.results.map((result) => ({
            __typename: 'User',
            id: result.id,
            firstName: result.firstName,
            preferredName: result.preferredName,
            lastName: result.lastName,
            email: result.email,
            phone: result.phone,
            dateOfBirth: result.dateOfBirth.toISOString().split('T')[0],
            status: result.status,
            province: result.province,
          })),
        },
      });
    });

    it('should call userProvider.getUsers', async () => {
      const mockUserList = userListFactory.build();

      stubUserProvider.getUsers.mockResolvedValueOnce(mockUserList);

      await client.query({
        query: usersQuery,
        variables: {
          userId: mockUser.id,
          query: mockQueryInput,
        },
      });

      expect(stubUserProvider.getUsers).toHaveBeenCalledOnce();
      expect(stubUserProvider.getUsers).toHaveBeenCalledWith(mockQueryInput);
    });
  });
});
