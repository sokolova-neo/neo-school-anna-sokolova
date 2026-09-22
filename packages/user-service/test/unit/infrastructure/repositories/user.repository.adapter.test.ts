import { connect, Mongoose, vstub } from '@neofinancial/neo-framework';

import { getDependencyRegistryInstance } from '../../../../src/configuration/dependency-registry';
import { userFactory } from '../../../factories/user/user.factory';
import { UserRepositoryPort } from '../../../../src/domain/repositories/user.repository.port';
import { RepositoryTokens } from '../../../../src/lib/repository-tokens';
import { UserReplicationRepositoryHookAdapter } from '../../../../src/infrastructure/repositories/user/user-replication.repository.hook';

describe('UserRepositoryAdapter', () => {
  const dependencyRegistry = getDependencyRegistryInstance();
  const stubHook = vstub<UserReplicationRepositoryHookAdapter>();

  let repository: UserRepositoryPort;
  let db: Mongoose;

  beforeAll(async () => {
    db = await connect(dependencyRegistry.resolve(Mongoose));
    dependencyRegistry.registerInstance(UserReplicationRepositoryHookAdapter, stubHook);
    repository = dependencyRegistry.resolve(RepositoryTokens.UserRepository);
  });

  afterEach(async () => {
    await db.connection.db.collection('users').deleteMany({});
  });

  afterAll(async () => {
    await db.disconnect();
  });

  describe('toObject', () => {
    it('should properly convert the fetched document to the domain type when fetched from the DB', async () => {
      const mockUser = userFactory.build();

      const result = await repository.create(mockUser);

      expect(result).toEqual({
        id: mockUser.id,
        replicationVersion: 0,
        firstName: mockUser.firstName,
        preferredName: mockUser.preferredName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        phone: mockUser.phone,
        dateOfBirth: mockUser.dateOfBirth,
        status: mockUser.status,
        province: mockUser.province,
      });
    });
  });

  describe('hooks', () => {
    it('should call onCreate hook after creating a user', async () => {
      const mockUser = userFactory.build();

      await repository.create(mockUser);

      expect(stubHook.onCreate).toHaveBeenCalledWith({
        id: mockUser.id,
        replicationVersion: 0,
        firstName: mockUser.firstName,
        preferredName: mockUser.preferredName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        phone: mockUser.phone,
        dateOfBirth: mockUser.dateOfBirth,
        status: mockUser.status,
        province: mockUser.province,
      });
      expect(stubHook.onUpdate).not.toHaveBeenCalled();
    });

    it('should call onUpdate hook after updating a user', async () => {
      const mockUser = userFactory.build({ email: 'changeMe@email.com' });

      const updateInput = {
        email: 'updated@email.com',
      };

      await repository.create(mockUser);
      await repository.updateOneByFields({ id: mockUser.id }, updateInput);

      expect(stubHook.onUpdate).toHaveBeenCalledTimes(1);
      expect(stubHook.onUpdate).toHaveBeenCalledWith({
        ...mockUser,
        replicationVersion: 1,
        email: updateInput.email,
      });
    });
  });
});
