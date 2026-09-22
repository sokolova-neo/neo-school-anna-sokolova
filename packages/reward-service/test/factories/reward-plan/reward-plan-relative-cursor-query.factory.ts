import { faker } from '@faker-js/faker';
import { RelativeCursorResultList } from '@neofinancial/neo-framework';
import { NeoFactory } from '@neofinancial/neo-test-factory';

import { RewardPlanRelativeQueryInput } from '../../../src/application/api/types/schema';
import { RewardPlan } from '../../../src/domain/entities/reward-plan/reward-plan';
import { rewardPlanFactory } from './reward-plan.factory';

const rewardPlanRelativeCursorQueryInputFactory = NeoFactory.define<RewardPlanRelativeQueryInput>(({ params }) => ({
  primaryCursor: {
    field: 'name',
    sort: 'ASC',
    type: 'STRING',
    cursor: params.primaryCursor?.cursor,
  },
  filter: [
    {
      field: 'id',
      operator: 'LT',
      type: 'OBJECT_ID',
      value: params.primaryCursor?.cursor,
    },
  ],
}));

const rewardPlanRelativeCursorResultListFactory = NeoFactory.define<RelativeCursorResultList<RewardPlan>>(
  ({ params }) => {
    const results = params.results ?? rewardPlanFactory.buildList(5);

    return {
      results,
      hasNextPage: faker.datatype.boolean(),
      primaryCursor: {
        field: 'name',
        sort: 'ASC',
        type: 'STRING',
        cursor: results.at(-1).id,
      },
    };
  },
);

export { rewardPlanRelativeCursorQueryInputFactory, rewardPlanRelativeCursorResultListFactory };
