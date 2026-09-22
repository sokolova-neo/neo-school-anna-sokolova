import { buildSubgraphSchema, DocumentNode, gql, GraphQLSchema } from '@neofinancial/neo-framework';

import getResolvers from '../resolvers';
import { getExternalSchema } from './external.schema';
import { getTransactionSchema } from './transaction.schema';
import { getTransactionsSchema } from './transactions.schema';

const getTypeDefs = (): DocumentNode => {
  const scalarSchema = gql`
    scalar Date
    scalar DateTime
    scalar ObjectID
    scalar Long
  `;

  return gql`
    ${scalarSchema}
    ${getExternalSchema()}
    ${getTransactionSchema()}
    ${getTransactionsSchema()}
  `;
};

const getSchema = (): GraphQLSchema => {
  const subgraphSchema = buildSubgraphSchema([
    {
      typeDefs: getTypeDefs(),
      resolvers: getResolvers(),
    },
  ]);

  return subgraphSchema;
};

export { getSchema, getTypeDefs };
