import config from 'config-dug';

import {
  BaseProducerTask,
  getSqsUrl,
  asyncLogger as logger,
  Producer,
  Sentry as sentry,
} from '@neofinancial/neo-framework';

import {
  TransactionInitiatedDTO,
  TransactionInitiatedTaskProducerPort,
} from '../../../domain/producers/task/transaction-initiated-task.producer.port';

const queueUrl = getSqsUrl(config.SQS_TRANSACTION_INITIATED_TASK_QUEUE_NAME as string);

@Producer
class TransactionInitiatedTaskProducerAdapter
  extends BaseProducerTask<TransactionInitiatedDTO>
  implements TransactionInitiatedTaskProducerPort
{
  constructor() {
    super(logger, sentry, queueUrl);
  }
}

export { TransactionInitiatedTaskProducerAdapter };
