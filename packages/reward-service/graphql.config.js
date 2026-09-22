module.exports = {
  serviceName: 'reward-service',
  variants: {
    development: [
      {
        graphName: 'neo-api',
        localSchemaFile: 'lib/schema.graphql',
        serviceUrl: 'http://localhost:8003/graphql',
      },
    ],
  },
};
