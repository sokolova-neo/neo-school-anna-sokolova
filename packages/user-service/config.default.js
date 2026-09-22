module.exports = {
  // App
  SERVICE_NAME: 'user-service',
  AWS_SECRETS_MANAGER_REGION: 'ca-central-1',
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

  // consumers
  EVENT_CONSUMERS_ENABLED: true,

  // producers
  EVENT_PRODUCERS_ENABLED: true,
  SNS_USER_REPLICATION_TOPIC_NAME: 'user-replication-event.fifo',

  // Triage Team
  TRIAGE_TEAM: 'engineering',
};
