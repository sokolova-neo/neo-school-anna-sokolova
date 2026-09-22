module.exports = {
  PORT: 8010,
  UPSTREAM_PORT: 8110,
  CORS_ALLOWLISTED_ORIGINS: undefined,
  SECURE_PORTAL_DOMAIN: undefined,
  TOKEN_SECRET: undefined,
  SESSION_COOKIE_NAME_ADMIN: 'neo.school-gateway',
  METRICS_REPORTER_PREFIX: 'school-gateway.school-api',
  APOLLO_KEY_ADMIN: undefined,
  APOLLO_GRAPH_ID: 'neo-school-api',
  APP_SHUTDOWN_WAIT_MS: 30000,
  SENTRY_DSN: undefined,

  ADJUDICATION_SERVICE_URL: undefined,
  ADMIN_AUTHORIZATION_SERVICE_URL: undefined,
  APPLICATION_SERVICE_URL: undefined,
  AUTO_TRANSFER_SERVICE_URL: undefined,

  //feature flags
  COLLECTING_TRAFFIC: false,
};
