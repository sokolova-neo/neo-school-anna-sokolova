module.exports = {
  serviceName: 'transaction-service',
  variants: {
    development: [
      {
        graphName: 'neo-api',
        localSchemaFile: 'lib/schema.graphql',
        serviceUrl: 'http://localhost:8002/graphql',
      },
    ],
  },
};
