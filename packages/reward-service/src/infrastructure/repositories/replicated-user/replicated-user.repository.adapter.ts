import config from 'config-dug';
import {
  BaseReplicationConsumerRepository,
  BaseReplicationObject,
  getSqsUrl,
  ReplicationConsumerRepository,
} from '@neofinancial/neo-framework';
import { Province } from '@neofinancial/neo-date';

import { getReplicatedUserSchema, ReplicatedUserDocument } from './replicated-user.repository.schema';
import { ReplicatedUser } from '../../../domain/entities/replicated-user/replicated-user';
import { ReplicatedUserRepositoryPort } from '../../../domain/repositories/replicated-user.repository.port';
import { enumFromValueString } from '../../../lib/enum-helper';
import { ReplicatedUserRepositoryHook } from './replicated-user.repository.hook';

export interface ReplicatedUserDTO extends BaseReplicationObject {
  province: string;
}

@ReplicationConsumerRepository(
  'User',
  getSqsUrl(config.SQS_USER_REPLICATION_QUEUE_NAME as string),
  getReplicatedUserSchema(),
  ReplicatedUserRepositoryHook,
)
class ReplicatedUserRepositoryAdapter
  extends BaseReplicationConsumerRepository<ReplicatedUserDocument, ReplicatedUser, ReplicatedUserDTO>
  implements ReplicatedUserRepositoryPort
{
  protected toObject(document: ReplicatedUserDocument): ReplicatedUser {
    return {
      id: document._id.toHexString(),
      province: document.province,
      replicationVersion: document._replicationVersion,
    };
  }

  replicationDTOToDomain(data: ReplicatedUserDTO): ReplicatedUser {
    return {
      id: data.id,
      replicationVersion: data.replicationVersion,
      province: enumFromValueString(data.province, Province),
    };
  }
}

export { ReplicatedUserRepositoryAdapter };
