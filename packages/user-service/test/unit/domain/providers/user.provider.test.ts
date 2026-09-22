import { faker } from '@faker-js/faker';
import {
  RelativeQuerySortDirection,
  RelativeQueryValueType,
  ResourceNotFoundError,
  vstub,
} from '@neofinancial/neo-framework';

import { getDependencyRegistryInstance } from '../../../../src/configuration/dependency-registry';
import { UserProviderAdapter } from '../../../../src/domain/providers/user/user.provider.adapter';
import { UserRepositoryPort } from '../../../../src/domain/repositories/user.repository.port';
import { ProviderTokens } from '../../../../src/lib/provider-tokens';
import { RepositoryTokens } from '../../../../src/lib/repository-tokens';
import { userListFactory } from '../../../factories/user/user-list.factory';
import { userFactory } from '../../../factories/user/user.factory';

describe('UserProvider', () => {
  const stubUserRepository = vstub<UserRepositoryPort>();
  const dependencyRegistry = getDependencyRegistryInstance();
  let provider: UserProviderAdapter;

  beforeAll(() => {
    dependencyRegistry.registerInstance(RepositoryTokens.UserRepository, stubUserRepository);
    provider = dependencyRegistry.resolve(ProviderTokens.UserProvider);
  });

  describe('getUser', () => {
    const user = userFactory.build();

    it('should return a user', async () => {
      stubUserRepository.findById.mockResolvedValueOnce(user);

      const result = await provider.getUser(user.id);

      expect(result).toEqual(user);
    });

    it('should call userRepository.findById', async () => {
      await provider.getUser(user.id);

      expect(stubUserRepository.findById).toHaveBeenCalledOnce();
      expect(stubUserRepository.findById).toHaveBeenCalledWith(user.id);
    });
  });

  describe('getUsers', () => {
    const userList = userListFactory.build();
    const input = {
      primaryCursor: {
        field: '_id',
        sort: RelativeQuerySortDirection.ASC,
        type: RelativeQueryValueType.OBJECT_ID,
      },
    };

    it('should return a user', async () => {
      stubUserRepository.findByRelativeCursorQuery.mockResolvedValueOnce(userList);

      const result = await provider.getUsers(input);

      expect(result).toEqual(userList);
    });

    it('should call userRepository.findById', async () => {
      await provider.getUsers(input);

      expect(stubUserRepository.findByRelativeCursorQuery).toHaveBeenCalledOnce();
      expect(stubUserRepository.findByRelativeCursorQuery).toHaveBeenCalledWith(input);
    });
  });

  describe('updateUser', () => {
    const user = userFactory.build();

    const update = {
      email: faker.internet.email(),
    };

    it('should return the updated user', async () => {
      stubUserRepository.updateOneByFields.mockResolvedValueOnce({ ...user, ...update });

      const result = await provider.updateUser(user.id, update);

      expect(result).toEqual({ ...user, ...update });
    });

    it('should call userRepository.updateOneByFields', async () => {
      stubUserRepository.updateOneByFields.mockResolvedValueOnce({ ...user, ...update });

      await provider.updateUser(user.id, update);

      expect(stubUserRepository.updateOneByFields).toHaveBeenCalledOnce();
      expect(stubUserRepository.updateOneByFields).toHaveBeenCalledWith({ id: user.id }, update);
    });

    it('should throw an error if the user does not exist', async () => {
      stubUserRepository.updateOneByFields.mockResolvedValueOnce(undefined);

      await expect(provider.updateUser(user.id, update)).rejects.toThrow(ResourceNotFoundError);
    });
  });
});
