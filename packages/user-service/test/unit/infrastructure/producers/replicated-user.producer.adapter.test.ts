import { getDependencyRegistryInstance } from '../../../../src/configuration/dependency-registry';
import { ReplicatedUserProducerAdapter } from '../../../../src/infrastructure/producers/events/replicated-user.producer.adapter';
import { ProducerTokens } from '../../../../src/lib/producer-tokens';
import { userFactory } from '../../../factories/user/user.factory';

describe('ReplicatedUserProducerAdapter', () => {
  const dependencyRegistry = getDependencyRegistryInstance();
  let producer: ReplicatedUserProducerAdapter;

  beforeAll(() => {
    producer = dependencyRegistry.resolve(ProducerTokens.ReplicatedUserProducer);
  });

  describe('domainToReplicationDTO', () => {
    const mockUser = userFactory.build();

    it('should transform domain user to DTO user', () => {
      const result = producer.domainToReplicationDTO(mockUser);

      expect(result).toEqual({
        id: mockUser.id,
        replicationVersion: mockUser.replicationVersion,
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
});
