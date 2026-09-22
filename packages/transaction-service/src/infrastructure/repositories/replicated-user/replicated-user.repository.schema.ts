import {
  BaseReplicationSubscriberDocument,
  createReplicationSubscriberSchema,
  Schema,
} from '@neofinancial/neo-framework';

import { ReplicatedUser, UserStatus } from '../../../domain/entities/replicated-user/replicated-user';

export interface ReplicatedUserDocument
  extends BaseReplicationSubscriberDocument,
    Omit<ReplicatedUser, 'id' | 'replicationVersion'> {}

const getReplicatedUserSchema = (): Schema =>
  createReplicationSubscriberSchema({
    status: {
      type: Schema.Types.String,
      required: true,
      enum: Object.values(UserStatus),
    },
  });

export { getReplicatedUserSchema };
