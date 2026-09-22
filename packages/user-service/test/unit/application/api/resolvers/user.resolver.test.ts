import { faker } from '@faker-js/faker';
import { AdminTestClient, adminTestContext, gql, vstub } from '@neofinancial/neo-framework';

import { getSchema } from '../../../../../src/application/api/admin/schema';
import { getDependencyRegistryInstance } from '../../../../../src/configuration/dependency-registry';
import { UserProviderPort } from '../../../../../src/domain/providers/user/user.provider.port';
import { ProviderTokens } from '../../../../../src/lib/provider-tokens';
import { userFactory } from '../../../../factories/user/user.factory';

describe('UserResolver', () => {
  const stubUserProvider = vstub<UserProviderPort>();
  const dependencyRegistry = getDependencyRegistryInstance();
  const user = userFactory.build();
  let client: AdminTestClient;

  beforeAll(() => {
    dependencyRegistry.registerInstance(ProviderTokens.UserProvider, stubUserProvider);

    client = new AdminTestClient(getSchema(), adminTestContext);
  });

  describe('resolver.user', () => {
    const query = gql`
      query User($input: ObjectID!) {
        user(id: $input) {
          id
          email
          phone
          firstName
          lastName
          preferredName
          province
          dateOfBirth
          status
        }
      }
    `;

    const variables = {
      input: user.id,
    };

    beforeEach(() => {
      stubUserProvider.getUser.mockResolvedValueOnce(user);
    });

    it('should resolve a user', async () => {
      const result = await client.query({
        query,
        variables,
      });

      expect(result.data).toEqual({
        user: {
          __typename: 'User',
          id: user.id,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          preferredName: user.preferredName,
          province: user.province,
          dateOfBirth: user.dateOfBirth.toISOString().split('T')[0],
          status: user.status,
        },
      });
    });

    it('should call userProvider.getUser', async () => {
      await client.query({
        query,
        variables,
      });

      expect(stubUserProvider.getUser).toHaveBeenCalledOnce();
      expect(stubUserProvider.getUser).toHaveBeenCalledWith(user.id);
    });
  });

  describe('mutation.updateUserDetails', () => {
    const user = userFactory.build();

    const mutation = gql`
      mutation UpdateUserDetails($input: UpdateUserDetailsInput!) {
        updateUserDetails(input: $input) {
          user {
            id
            firstName
            lastName
            email
          }
        }
      }
    `;

    const variables = {
      input: {
        userId: user.id,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      },
    };

    beforeEach(() => {
      stubUserProvider.updateUser.mockResolvedValueOnce({ ...user, ...variables.input });
    });

    it('should return the updated user', async () => {
      const result = await client.mutate({
        mutation,
        variables,
      });

      expect(result.data).toEqual({
        updateUserDetails: {
          __typename: 'UpdateUserDetailsResponse',
          user: {
            __typename: 'User',
            id: user.id,
            firstName: variables.input.firstName,
            lastName: variables.input.lastName,
            email: user.email,
          },
        },
      });
    });

    it('should call userProvider.mockResolvedValueOnce', async () => {
      await client.mutate({
        mutation,
        variables,
      });

      expect(stubUserProvider.updateUser).toHaveBeenCalledOnce();
      expect(stubUserProvider.updateUser).toHaveBeenCalledWith(user.id, {
        firstName: variables.input.firstName,
        lastName: variables.input.lastName,
      });
    });
  });

  describe('mutation.updateUseContact', () => {
    const user = userFactory.build();

    const mutation = gql`
      mutation UpdateUserContact($input: UpdateUserContactInput!) {
        updateUserContact(input: $input) {
          user {
            id
            firstName
            email
          }
        }
      }
    `;

    const variables = {
      input: {
        userId: user.id,
        email: faker.internet.email(),
      },
    };

    beforeEach(() => {
      stubUserProvider.updateUser.mockResolvedValueOnce({ ...user, ...variables.input });
    });

    it('should return the updated user', async () => {
      const result = await client.mutate({
        mutation,
        variables,
      });

      expect(result.data).toEqual({
        updateUserContact: {
          __typename: 'UpdateUserContactResponse',
          user: {
            __typename: 'User',
            id: user.id,
            firstName: user.firstName,
            email: variables.input.email,
          },
        },
      });
    });

    it('should call userProvider.mockResolvedValueOnce', async () => {
      await client.mutate({
        mutation,
        variables,
      });

      expect(stubUserProvider.updateUser).toHaveBeenCalledOnce();
      expect(stubUserProvider.updateUser).toHaveBeenCalledWith(user.id, {
        email: variables.input.email,
      });
    });
  });
});
