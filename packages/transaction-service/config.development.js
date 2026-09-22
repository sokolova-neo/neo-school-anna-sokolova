module.exports = {
  PORT: 8002,
  APP_SHUTDOWN_DELAY_MS: 1500,
  DB_SHUTDOWN_WAIT_MS: 0,

  TOKEN_SECRET: 'super secret token',
  MONGO_CONNECTION_STRING: 'mongodb://localhost:27017/transactionService?retryWrites=true',
  LOG_LEVEL: 'DEBUG',

  // DATADOG
  DATADOG_ENABLED: false,
  DATADOG_ANALYTICS_ENABLED: false,
  APM_ENABLED: false,
  APM_RUNTIME_METRICS_ENABLED: false,

  // PRODUCERS
  EVENT_PRODUCERS_ENABLED: true,
  SNS_ARN: 'arn:aws:sns:ca-central-1:000000000000:transaction-service',
  SNS_ARN_ENV: undefined,

  // CONSUMERS
  EVENT_CONSUMERS_ENABLED: true,
  SQS_URL: 'http://localhost:4566/000000000000/transaction-service',
};
