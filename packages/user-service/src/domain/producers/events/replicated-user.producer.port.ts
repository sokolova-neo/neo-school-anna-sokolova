import { BaseReplicationDTO, BaseReplicationProducer } from '@neofinancial/neo-framework';
import { Province } from '@neofinancial/neo-date';

import { Status, User } from '../../entities/user';

export interface ReplicatedUserDTO extends BaseReplicationDTO {
  firstName: string;
  preferredName?: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  status: Status;
  province: Province;
}

export interface ReplicatedUserProducerPort extends BaseReplicationProducer<User, ReplicatedUserDTO> {}
