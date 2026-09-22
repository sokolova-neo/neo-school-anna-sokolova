const fs = require('fs');
const path = require('path');

(() => {
  const queues = [];
  const topics = [];
  const subscriptions = [];
  const packages = ['user-service', 'transaction-service', 'reward-service'];

  const getQueueName = (name, isFifo) => `${name}${isFifo ? '.fifo' : ''}`;
  const getDlQueueName = (name, isFifo) => `${name}-dlq${isFifo ? '.fifo' : ''}`;

  const initTopics = async (service) => {
    try {
      const topicResources = require(`../../${service}/cloud/sns-topics.json`);
      console.log(`Generating topics script for ${service}`);
      for (topic of Object.values(topicResources)) {
        const isFifo = !!topic.fifo_configuration?.enabled;
        const topicName = getQueueName(topic.name, isFifo);

        topics.push(`awslocal sns create-topic --name ${topicName}${isFifo ? ' --attributes FifoTopic=true' : ''}`);
      }
    } catch {}
  };
  const initQueue = async (name, isFifo) => {
    const pushQueueCommand = (name) =>
      queues.push(
        `awslocal sqs create-queue --queue-name ${name} --attributes MessageRetentionPeriod=86400${
          isFifo ? ' --attributes FifoQueue=true' : ''
        }`,
      );
    const queueName = getQueueName(name, isFifo);
    const dlQueueName = getDlQueueName(name, isFifo);

    pushQueueCommand(queueName);
    pushQueueCommand(dlQueueName);
  };

  const initQueuesAndSubscriptions = async (service) => {
    try {
      const subscriptionResources = require(`../../${service}/cloud/event-subscriptions.json`);
      console.log(`Generating queues and subscriptions script for ${service}`);
      for (const subscription of Object.values(subscriptionResources)) {
        const isFifo = !!subscription.fifo_configuration?.enabled;
        const preFifoQueueName = subscription.queue_name;
        const topicName = getQueueName(subscription.sns_topic.name, isFifo);

        initQueue(preFifoQueueName, isFifo);

        subscriptions.push(
          `awslocal sns subscribe --topic-arn arn:aws:sns:ca-central-1:000000000000:${topicName} --notification-endpoint arn:aws:sqs:ca-central-1:000000000000:${getQueueName(
            preFifoQueueName,
            isFifo,
          )} --protocol sqs`,
        );
      }
    } catch {}
  };

  const initTaskQueues = async (service) => {
    try {
      const taskResources = require(`../../${service}/cloud/task-queues.json`);
      console.log(`Generating task queues script for ${service}`);

      for (const task of Object.values(taskResources)) {
        const isFifo = !!task.fifo_configuration?.enabled;
        const taskName = getQueueName(task.name, isFifo);

        initQueue(taskName, isFifo);
      }
    } catch {}
  };

  for (const service of packages) {
    initTopics(service);
  }

  for (const service of packages) {
    initQueuesAndSubscriptions(service);
  }

  for (const service of packages) {
    initTaskQueues(service);
  }

  const commands = ['#!/bin/sh', '##########THIS IS AN AUTO-GENERATED FILE##########'].concat(
    ['aws configure set  endpoint-url http://localstack:4566'],
    ['aws configure set region ca-central-1'],
    queues,
    topics,
    subscriptions,
    ['echo AWS async messaging initialization complete!'],
  );

  const filePath = path.join(__dirname, 'localstack', 'init-queues.sh');
  fs.writeFileSync(filePath, commands.join('\n'));
  fs.chmodSync(filePath, fs.constants.S_IRWXU);

  console.log('Generate init script complete.');
})();
