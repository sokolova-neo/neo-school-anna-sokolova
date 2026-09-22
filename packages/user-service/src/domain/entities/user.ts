import { Province } from '@neofinancial/neo-date';
import { BaseReplicationObject } from '@neofinancial/neo-framework';

export interface User extends BaseReplicationObject {
  firstName: string;
  preferredName?: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  status: Status;
  province: Province;
}

export enum Status {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  FROZEN = 'FROZEN',
}
