import { ReplicationRepositoryPort } from '@neofinancial/neo-framework';

import { ReplicatedUser } from '../entities/replicated-user/replicated-user';

export interface ReplicatedUserRepositoryPort extends ReplicationRepositoryPort<ReplicatedUser> {}
