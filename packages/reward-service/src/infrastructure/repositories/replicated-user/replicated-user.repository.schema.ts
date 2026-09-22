import { Province } from '@neofinancial/neo-date';
import {
  BaseReplicationSubscriberDocument,
  createReplicationSubscriberSchema,
  ObjectId,
  Schema,
} from '@neofinancial/neo-framework';

import { ReplicatedUser } from '../../../domain/entities/replicated-user/replicated-user';

export interface ReplicatedUserDocument
  extends BaseReplicationSubscriberDocument,
    Omit<ReplicatedUser, 'id' | 'replicationVersion'> {
  _id: ObjectId;
  _replicationVersion: number;
}

const getReplicatedUserSchema = (): Schema =>
  createReplicationSubscriberSchema({
    province: {
      type: Schema.Types.String,
      required: true,
      enum: Object.values(Province),
    },
  });

export { getReplicatedUserSchema };
