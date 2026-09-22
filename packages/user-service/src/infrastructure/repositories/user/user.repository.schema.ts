import { Province } from '@neofinancial/neo-date';
import {
  BaseReplicationPublisherDocument,
  createReplicationPublisherSchema,
  Schema,
} from '@neofinancial/neo-framework';

import { Status, User } from '../../../domain/entities/user';

interface UserDocument extends BaseReplicationPublisherDocument, Omit<User, 'id' | 'replicationVersion'> {}

const userSchema = createReplicationPublisherSchema({
  firstName: { type: Schema.Types.String, required: true },
  preferredName: { type: Schema.Types.String, required: false },
  lastName: { type: Schema.Types.String, required: true },
  email: { type: Schema.Types.String, required: true },
  phone: { type: Schema.Types.String },
  dateOfBirth: { type: Schema.Types.Date, required: true },
  status: { type: Schema.Types.String, required: true, enum: Object.values(Status) },
  province: { type: Schema.Types.String, required: true, enum: Object.values(Province) },
});

export { UserDocument, userSchema };
