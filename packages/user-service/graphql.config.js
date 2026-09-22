module.exports = {
  serviceName: 'user-service',
  variants: {
    development: [
      {
        graphName: 'neo-api',
        localSchemaFile: 'lib/schema.graphql',
        serviceUrl: 'http://localhost:8001/graphql',
      },
    ],
  },
};
