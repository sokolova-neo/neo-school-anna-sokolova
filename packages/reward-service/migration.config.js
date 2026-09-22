const config = require('config-dug').default;

module.exports = {
  MONGO_CONNECTION_STRING: config.MONGO_CONNECTION_STRING,
  DATABASE_NAME: 'rewardService',

  // The migrations dir, can be a relative or absolute path. Only edit this when really necessary.
  MIGRATIONS_DIR: 'migrations',

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  MIGRATIONS_COLLECTION_NAME: 'migrations',
};
