import { buildSubgraphSchema, DocumentNode, gql, GraphQLSchema } from '@neofinancial/neo-framework';

import getResolvers from '../resolvers';
import { getExternalSchema } from './external.schema';
import { getRewardPlanSchema } from './reward-plan.schema';
import { getRewardPlansSchema } from './reward-plans.schema';

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
    ${getRewardPlanSchema()}
    ${getRewardPlansSchema()}
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
