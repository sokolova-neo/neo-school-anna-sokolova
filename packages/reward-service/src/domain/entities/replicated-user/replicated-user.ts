import { BaseReplicationObject } from '@neofinancial/neo-framework';
import { Province } from '@neofinancial/neo-date';

export interface ReplicatedUser extends BaseReplicationObject {
  id: string;
  province: Province;
}
