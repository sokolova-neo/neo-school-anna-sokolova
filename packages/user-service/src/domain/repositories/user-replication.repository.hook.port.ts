import { ReplicationHooksProviderPort } from '@neofinancial/neo-framework';

import { User } from '../entities/user';

export interface UserReplicationRepositoryHookPort extends ReplicationHooksProviderPort<User> {}
