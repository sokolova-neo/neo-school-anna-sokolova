import { ReplicationHooksProviderAdapter, RepositoryHook } from '@neofinancial/neo-framework';

import { User } from '../../../domain/entities/user';
import { ReplicatedUserProducerPort } from '../../../domain/producers/events/replicated-user.producer.port';
import { UserReplicationRepositoryHookPort } from '../../../domain/repositories/user-replication.repository.hook.port';
import { ProducerTokens } from '../../../lib/producer-tokens';
import { inject } from '../../../lib/strict-inject';

@RepositoryHook
class UserReplicationRepositoryHookAdapter
  extends ReplicationHooksProviderAdapter<User>
  implements UserReplicationRepositoryHookPort
{
  constructor(
    @inject(ProducerTokens.ReplicatedUserProducer)
    replicatedUserProducer: ReplicatedUserProducerPort,
  ) {
    super(replicatedUserProducer);
  }
}

export { UserReplicationRepositoryHookAdapter };
