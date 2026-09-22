import { type DocumentNode } from 'graphql';
import {
  type MutationTuple,
  useMutation,
  type MutationHookOptions,
} from '@apollo/client';

type NoArgsMutationHookOptions<T> = Omit<
  MutationHookOptions<T, void>,
  'variables'
>;

function generateMutationHook<InputArgs, DataResult>(
  gqlMutation: DocumentNode,
): (
  options?: MutationHookOptions<DataResult, InputArgs>,
) => MutationTuple<DataResult, InputArgs>;
function generateMutationHook<DataResult>(
  gqlMutation: DocumentNode,
): (
  options?: NoArgsMutationHookOptions<DataResult>,
) => MutationTuple<DataResult, void>;

function generateMutationHook<InputArgs, DataResult>(
  gqlMutation: DocumentNode,
) {
  return (
    options?: MutationHookOptions<DataResult, InputArgs>,
  ): MutationTuple<DataResult, InputArgs> =>
    useMutation<DataResult, InputArgs>(gqlMutation, options || {});
}

export default generateMutationHook;
