import { vstub } from '@neofinancial/neo-framework';

import { getDependencyRegistryInstance } from '../../../../src/configuration/dependency-registry';
import { ReplicatedUserProducerPort } from '../../../../src/domain/producers/events/replicated-user.producer.port';
import { UserReplicationRepositoryHookAdapter } from '../../../../src/infrastructure/repositories/user/user-replication.repository.hook';
import { ProducerTokens } from '../../../../src/lib/producer-tokens';
import { userFactory } from '../../../factories/user/user.factory';

describe('UserUpsertedRepositoryHookAdapter', () => {
  const stubReplicatedUserProducer = vstub<ReplicatedUserProducerPort>();
  const dependencyRegistry = getDependencyRegistryInstance();
  let hook: UserReplicationRepositoryHookAdapter;

  beforeAll(() => {
    dependencyRegistry.registerInstance(ProducerTokens.ReplicatedUserProducer, stubReplicatedUserProducer);

    hook = dependencyRegistry.resolve(UserReplicationRepositoryHookAdapter);
  });

  describe('onCreate', () => {
    const mockUser = userFactory.build();

    it('should call replicatedUserProducer.replicate', async () => {
      await hook.onCreate(mockUser);

      expect(stubReplicatedUserProducer.replicate).toHaveBeenCalledOnce();
      expect(stubReplicatedUserProducer.replicate).toHaveBeenCalledWith({
        data: mockUser,
        flags: { created: true },
      });
    });
  });

  describe('onUpdate', () => {
    const mockNewUser = userFactory.build();

    it('should call replicatedUserProducer.replicate', async () => {
      await hook.onUpdate(mockNewUser);

      expect(stubReplicatedUserProducer.replicate).toHaveBeenCalledOnce();
      expect(stubReplicatedUserProducer.replicate).toHaveBeenCalledWith({
        data: mockNewUser,
        flags: { updated: true },
      });
    });
  });

  describe('onDelete', () => {
    const mockDeletedUser = userFactory.build();

    it('should call replicatedUserProducer.replicate', async () => {
      await hook.onDelete(mockDeletedUser);

      expect(stubReplicatedUserProducer.replicate).toHaveBeenCalledOnce();
      expect(stubReplicatedUserProducer.replicate).toHaveBeenCalledWith({
        data: mockDeletedUser,
        flags: { deleted: true },
      });
    });
  });
});
