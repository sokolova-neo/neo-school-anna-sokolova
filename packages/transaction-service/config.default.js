module.exports = {
  // App
  SERVICE_NAME: 'transaction-service',
  AWS_SECRETS_MANAGER_REGION: 'ca-central-1',
  AWS_ENDPOINT_URL: 'http://localhost:4566',
  PORT: undefined,
  APP_SHUTDOWN_DELAY_MS: 30000,
  DB_SHUTDOWN_WAIT_MS: 20000,
  GRAPHQL_QUERY_COST_LIMIT: 1000000,
  SENTRY_DSN: undefined,
  SENTRY_TRIAGE_TEAM: 'engineering',

  TOKEN_SECRET: undefined,
  MONGO_CONNECTION_STRING: undefined,
  MONGOOSE_DEBUG: false,
  MONGO_VERSION: '6.0.11',

  // DATADOG
  DATADOG_DEBUG: false,
  DATADOG_ENABLED: undefined,
  DATADOG_ANALYTICS_ENABLED: undefined,

  APM_ENABLED: false,
  APM_RUNTIME_METRICS_ENABLED: false,

  // CONSUMERS
  EVENT_CONSUMERS_ENABLED: true,
  SQS_USER_REPLICATION_QUEUE_NAME: 'user-replication-event.fifo',

  // PRODUCERS
  EVENT_PRODUCERS_ENABLED: true,
  SNS_TRANSACTION_CREATED_TOPIC_NAME: 'transaction-created-event',

  // TASKS
  SQS_TRANSACTION_INITIATED_TASK_QUEUE_NAME: 'transaction-initiated-task',

  // Triage Team
  TRIAGE_TEAM: 'engineering',
};
