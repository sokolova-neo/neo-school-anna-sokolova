import config from 'config-dug';
import {
  BaseReplicationProducer,
  getSnsArn,
  asyncLogger as logger,
  Producer,
  Sentry as sentry,
} from '@neofinancial/neo-framework';

import {
  ReplicatedUserDTO,
  ReplicatedUserProducerPort,
} from '../../../domain/producers/events/replicated-user.producer.port';
import { User } from '../../../domain/entities/user';

const snsArn = getSnsArn(config.SNS_USER_REPLICATION_TOPIC_NAME as string);

@Producer
class ReplicatedUserProducerAdapter
  extends BaseReplicationProducer<User, ReplicatedUserDTO>
  implements ReplicatedUserProducerPort
{
  constructor() {
    super({ logger, sentry, arn: snsArn });
  }

  domainToReplicationDTO(user: User): ReplicatedUserDTO {
    return {
      id: user.id,
      replicationVersion: user.replicationVersion,
      firstName: user.firstName,
      preferredName: user.preferredName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      status: user.status,
      province: user.province,
    };
  }
}

export { ReplicatedUserProducerAdapter };
