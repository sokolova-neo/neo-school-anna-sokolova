// ******** THIS FILE IS GENERATED, MANUAL CHANGES WILL BE OVERWRITTEN ******** //

import {
  Buffer,
  DateScalar,
  DateTimeScalar,
  getResolverSchemaMap,
  Long,
  Markdown,
  ObjectID,
  ResolverSchemaMap,
  URL,
} from '@neofinancial/neo-framework';
import merge from 'lodash/merge';

import { RewardPlansResolver } from './reward-plans.resolver';

const resolversMap = (): ResolverSchemaMap => {
  return getResolverSchemaMap({
    Query: [RewardPlansResolver],
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getResolvers = (): any => {
  return merge(
    {
      Buffer,
      Date: DateScalar,
      DateTime: DateTimeScalar,
      Long,
      Markdown,
      ObjectID,
      URL,
    },
    resolversMap().export(),
  );
};

// eslint-disable-next-line import/no-default-export
export default getResolvers;
export { resolversMap };
