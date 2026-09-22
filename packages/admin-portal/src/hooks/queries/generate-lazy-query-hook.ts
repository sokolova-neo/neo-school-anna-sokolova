import { type OperationVariables, type QueryHookOptions } from '@apollo/client';
import { type DocumentNode } from 'graphql';
import merge from 'lodash/merge';

import {
  useImperativeQuery,
  type ImperativeQueryResult,
} from '../use-imperative-query';

type NoArgsQueryHookOptions<T> = Omit<QueryHookOptions<T>, 'variables'>;

// Lazy Query Overload Types
function generateLazyQueryHook<
  InputArgs extends OperationVariables,
  DataResult,
>(
  gqlMutation: DocumentNode,
  defaultOptions?: QueryHookOptions<DataResult, Partial<InputArgs>>,
): (
  options?: QueryHookOptions<DataResult, InputArgs>,
) => ImperativeQueryResult<DataResult, InputArgs>;
function generateLazyQueryHook<DataResult>(
  gqlMutation: DocumentNode,
  defaultOptions?: NoArgsQueryHookOptions<DataResult>,
): (
  options?: NoArgsQueryHookOptions<DataResult>,
) => ImperativeQueryResult<DataResult, void>;

function generateLazyQueryHook<
  InputArgs extends OperationVariables,
  DataResult,
>(
  gqlMutation: DocumentNode,
  defaultOptions:
    | QueryHookOptions<DataResult, Partial<InputArgs>>
    | NoArgsQueryHookOptions<DataResult> = {},
) {
  return (
    options: QueryHookOptions<DataResult, InputArgs> = {},
  ): ImperativeQueryResult<DataResult, InputArgs> =>
    useImperativeQuery<DataResult, InputArgs>(
      gqlMutation,
      merge({}, defaultOptions, options),
    );
}

export { generateLazyQueryHook };
