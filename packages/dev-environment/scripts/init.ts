const chalk = require('chalk');
const { SNS } = require('@aws-sdk/client-sns');
const { SQS } = require('@aws-sdk/client-sqs');

interface SubscriptionResources {
  [key: string]: {
    fifo_configuration?: {
      enabled: boolean;
    };
    queue_name: string;
    sns_topic: {
      name: string;
    };
  };
}

interface Resources {
  [key: string]: {
    name: string;
    fifo_configuration?: {
      enabled: boolean;
    };
  };
}

interface Subscription {
  TopicArn: string;
  Endpoint: string;
}

(async () => {
  const sns = new SNS({
    endpoint: 'http://localhost:4566',
    region: 'ca-central-1',
    credentials: {
      accessKeyId: 'test',
      secretAccessKey: 'test',
    },
  });
  const sqs = new SQS({
    endpoint: 'http://localhost:4566',
    region: 'ca-central-1',
    credentials: {
      accessKeyId: 'test',
      secretAccessKey: 'test',
    },
  });

  let topicCount = 0;
  let queueCount = 0;
  let subscriptionCount = 0;

  const packages = ['user-service', 'transaction-service', 'reward-service'];
  const subscriptions: Subscription[] = [];

  const getQueueName = (name: string, isFifo: boolean) => `${name}${isFifo ? '.fifo' : ''}`;
  const getDlQueueName = (name: string, isFifo: boolean) => `${name}-dlq${isFifo ? '.fifo' : ''}`;

  const initTopics = async (service: string) => {
    try {
      const topicResources = (await require(`../../${service}/cloud/sns-topics.json`)) as Resources;
      await Promise.all(
        Object.values(topicResources).map(async (topic) => {
          const isFifo = !!topic.fifo_configuration?.enabled;
          const topicName = getQueueName(topic.name, isFifo);

          const newTopic = await sns.createTopic({
            Name: topicName,
            Attributes: {
              FifoTopic: isFifo,
            },
          });

          console.log(`${chalk.yellow('TOPIC:     ')} ${newTopic.TopicArn}`);

          topicCount += 1;
        })
      );
    } catch {}
  };

  const initQueue = async (name: string, isFifo: boolean) => {
    const createQueue = async (name: string, isFifo: boolean) => {
      const newQueue = await sqs.createQueue({
        QueueName: name,
        Attributes: {
          MessageRetentionPeriod: '86400',
          ...(isFifo ? { FifoQueue: isFifo } : {}),
        },
      });

      console.log(`${chalk.green('QUEUE:     ')} ${newQueue.QueueUrl}`);
      queueCount += 1;
    };

    const queueName = getQueueName(name, isFifo);
    const dlQueueName = getDlQueueName(name, isFifo);
    try {
      await createQueue(queueName, isFifo);
      await createQueue(dlQueueName, isFifo);
    } catch (error) {
      console.log(`${chalk.redBright('ERROR:     ')}`, error instanceof Error ? error.message : error);
    }
  };

  const initSubscription = async ({ Endpoint, TopicArn }: Subscription) => {
    try {
      const newSubscription = await sns.subscribe({
        Protocol: 'sqs',
        TopicArn,
        Endpoint,
      });

      console.log(`${chalk.magenta('SUBSCRIBE: ')} ${newSubscription.SubscriptionArn}`);
      subscriptionCount += 1;
    } catch (error) {
      console.log(error);
      console.log(`${chalk.redBright('ERROR:     ')}`, error instanceof Error ? error.message : error);
    }
  };

  const initQueuesAndSubscriptions = async (service: string) => {
    try {
      const subscriptionResources =
        (await require(`../../${service}/cloud/event-subscriptions.json`)) as SubscriptionResources;
      await Promise.all(
        Object.values(subscriptionResources).map(async (subscription) => {
          const isFifo = !!subscription.fifo_configuration?.enabled;
          const preFifoQueueName = subscription.queue_name;
          const topicName = getQueueName(subscription.sns_topic.name, isFifo);
          try {
            await initQueue(preFifoQueueName, isFifo);

            subscriptions.push({
              TopicArn: `arn:aws:sns:ca-central-1:000000000000:${topicName}`,
              Endpoint: `http://localhost:4566/000000000000/${getQueueName(preFifoQueueName, isFifo)}`,
            });
          } catch (error) {
            console.log(error);
            console.log(`${chalk.redBright('ERROR:     ')}`, error instanceof Error ? error.message : error);
          }
        })
      );
    } catch {}
  };

  const initTaskQueues = async (service: string) => {
    try {
      const taskResources = (await require(`../../${service}/cloud/task-queues.json`)) as Resources;
      await Promise.all(
        Object.values(taskResources).map(async (task) => {
          const isFifo = !!task.fifo_configuration?.enabled;
          const taskName = getQueueName(task.name, isFifo);
          try {
            await initQueue(taskName, isFifo);
          } catch (error) {
            console.log(`${chalk.redBright('ERROR:     ')}`, error instanceof Error ? error.message : error);
          }
        })
      );
    } catch {}
  };

  await Promise.all(packages.map(async (service) => initTopics(service)));

  await Promise.all(packages.map(async (service) => initQueuesAndSubscriptions(service)));

  await Promise.all(packages.map(async (service) => initTaskQueues(service)));

  await Promise.all(subscriptions.map(async (subscription) => initSubscription(subscription)));

  console.log(`\nCreated ${topicCount} topics, ${queueCount} queues, ${subscriptionCount} subscriptions`);
})();
