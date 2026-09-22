module.exports = {
  TOKEN_SECRET: 'token',
  MONGO_VERSION: '6.0.11',
  USE_INMEMORY_DATABASE: true,
  MONGO_CONNECTION_STRING: 'mongodb://localhost:27017/rewardService?retryWrites=true&j=false',

  SENTRY_DSN: undefined,

  DATADOG_ENABLED: false,
  DATADOG_ANALYTICS_ENABLED: false,
  APM_ENABLED: false,

  // PRODUCERS
  EVENT_PRODUCERS_ENABLED: false,

  // CONSUMERS
  EVENT_CONSUMERS_ENABLED: false,
  SQS_USER_REPLICATION_QUEUE_NAME: 'noop',
};
