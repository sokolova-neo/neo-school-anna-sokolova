import { BaseReplicationPublisherRepository, ReplicationPublisherRepository } from '@neofinancial/neo-framework';

import { User } from '../../../domain/entities/user';
import { CreateUser, UpdateUser, UserRepositoryPort } from '../../../domain/repositories/user.repository.port';
import { UserDocument, userSchema } from './user.repository.schema';
import { UserReplicationRepositoryHookAdapter } from './user-replication.repository.hook';

@ReplicationPublisherRepository('User', userSchema, UserReplicationRepositoryHookAdapter)
class UserRepositoryAdapter
  extends BaseReplicationPublisherRepository<UserDocument, User, CreateUser, UpdateUser>
  implements UserRepositoryPort
{
  public toObject(document: UserDocument): User {
    return {
      id: document._id.toHexString(),
      replicationVersion: document._replicationVersion ?? 0,
      email: document.email,
      firstName: document.firstName,
      preferredName: document.preferredName,
      lastName: document.lastName,
      phone: document.phone,
      dateOfBirth: document.dateOfBirth,
      status: document.status,
      province: document.province,
    };
  }
}

export { UserRepositoryAdapter };
