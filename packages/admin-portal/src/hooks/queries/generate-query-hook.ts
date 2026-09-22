import { type DocumentNode } from 'graphql';
import {
  type QueryHookOptions,
  type QueryResult,
  type OperationVariables,
  useQuery,
} from '@apollo/client';

type NoArgsQueryHookOptions<T> = Omit<QueryHookOptions<T>, 'variables'>;

function generateQueryHook<InputArgs extends OperationVariables, DataResult>(
  gqlMutation: DocumentNode,
): (
  options?: QueryHookOptions<DataResult, InputArgs>,
) => QueryResult<DataResult, InputArgs>;
function generateQueryHook<DataResult>(
  gqlMutation: DocumentNode,
): (options?: NoArgsQueryHookOptions<DataResult>) => QueryResult<DataResult>;

function generateQueryHook<InputArgs extends OperationVariables, DataResult>(
  gqlMutation: DocumentNode,
) {
  return (
    options?: QueryHookOptions<DataResult, InputArgs>,
  ): QueryResult<DataResult, InputArgs> =>
    useQuery<DataResult, InputArgs>(gqlMutation, options || {});
}

export { generateQueryHook };
