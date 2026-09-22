import config from 'config-dug';

import {
  BaseProducer,
  getSnsArn,
  asyncLogger as logger,
  Producer,
  Sentry as sentry,
} from '@neofinancial/neo-framework';

import {
  TransactionCreatedDTO,
  TransactionCreatedProducerPort,
} from '../../../domain/producers/events/transaction-created.producer.port';

const snsArn = getSnsArn(config.SNS_TRANSACTION_CREATED_TOPIC_NAME as string);

@Producer
class TransactionCreatedProducerAdapter
  extends BaseProducer<TransactionCreatedDTO>
  implements TransactionCreatedProducerPort
{
  constructor() {
    super(logger, sentry, snsArn);
  }
}

export { TransactionCreatedProducerAdapter };
