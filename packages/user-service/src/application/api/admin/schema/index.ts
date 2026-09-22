import { buildSubgraphSchema, DocumentNode, gql, GraphQLSchema } from '@neofinancial/neo-framework';

import getResolvers from '../resolvers';
import { getUserSchema } from './user.schema';
import { getUsersSchema } from './users.schema';

const getTypeDefs = (): DocumentNode => {
  const scalarSchema = gql`
    scalar Date
    scalar DateTime
    scalar ObjectID
    scalar Long
  `;

  return gql`
    ${scalarSchema}
    ${getUserSchema()}
    ${getUsersSchema()}
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
