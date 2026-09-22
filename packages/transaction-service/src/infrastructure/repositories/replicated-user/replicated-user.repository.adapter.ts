import config from 'config-dug';
import {
  BaseReplicationConsumerRepository,
  BaseReplicationObject,
  getSqsUrl,
  ReplicationConsumerRepository,
} from '@neofinancial/neo-framework';

import { getReplicatedUserSchema, ReplicatedUserDocument } from './replicated-user.repository.schema';
import { ReplicatedUser, UserStatus } from '../../../domain/entities/replicated-user/replicated-user';
import { ReplicatedUserRepositoryPort } from '../../../domain/repositories/replicated-user.repository.port';
import { enumFromValueString } from '../../../lib/enum-helper';

export interface ReplicatedUserDTO extends BaseReplicationObject {
  status: string;
}

@ReplicationConsumerRepository(
  'User',
  getSqsUrl(config.SQS_USER_REPLICATION_QUEUE_NAME as string),
  getReplicatedUserSchema(),
)
class ReplicatedUserRepositoryAdapter
  extends BaseReplicationConsumerRepository<ReplicatedUserDocument, ReplicatedUser, ReplicatedUserDTO>
  implements ReplicatedUserRepositoryPort
{
  protected toObject(document: ReplicatedUserDocument): ReplicatedUser {
    return {
      id: document._id.toHexString(),
      replicationVersion: document._replicationVersion ?? 0,
      status: document.status,
    };
  }

  replicationDTOToDomain(data: ReplicatedUserDTO): ReplicatedUser {
    return {
      id: data.id,
      replicationVersion: data.replicationVersion,
      status: enumFromValueString(data.status, UserStatus),
    };
  }
}

export { ReplicatedUserRepositoryAdapter };
