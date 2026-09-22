import { gql } from '@apollo/client';
import generateMutationHook from '@/hooks/mutations/generate-mutation-hook';
import type {
  UpdateUserDetailsMutation as Response,
  UpdateUserDetailsMutationVariables as Variables,
} from './__graphql/use-update-user-details-mutation.generated.d';

const updateUserDetailsMutation = gql`
  mutation UpdateUserDetails($input: UpdateUserDetailsInput!) {
    updateUserDetails(input: $input) {
      user {
        id
        firstName
        lastName
        preferredName
        province
      }
    }
  }
`;

const useUpdateUserDetailsMutation = generateMutationHook<Variables, Response>(
  updateUserDetailsMutation,
);

export { useUpdateUserDetailsMutation };
