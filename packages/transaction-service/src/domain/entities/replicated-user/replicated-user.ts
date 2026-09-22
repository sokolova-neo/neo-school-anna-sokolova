import { BaseReplicationObject } from '@neofinancial/neo-framework';

export interface ReplicatedUser extends BaseReplicationObject {
  status: UserStatus;
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  FROZEN = 'FROZEN',
}
