import { gql } from '@apollo/client';

import { type User, UserStatus, Province } from '../../../types/user';
import { generateQueryHook } from '../../../hooks/queries/generate-query-hook';
import { generateLazyQueryHook } from '../../../hooks/queries/generate-lazy-query-hook';
import {
  enumFromValueString,
  enumFromKeyString,
} from '../../../lib/enum-helper';

import {
  type UserQuery,
  type UserQueryVariables,
} from './__graphql/use-user-details-query.generated.d';

const userDetailsQuery = gql`
  query User($input: ObjectID!) {
    user(id: $input) {
      id
      email
      phone
      firstName
      lastName
      preferredName
      province
      dateOfBirth
      status
    }
  }
`;

const mapToUser = (queryUser: UserQuery['user']): User => ({
  id: queryUser.id,
  email: queryUser.email,
  phone: queryUser.phone,
  firstName: queryUser.firstName,
  lastName: queryUser.lastName,
  preferredName: queryUser.preferredName ? queryUser.preferredName : undefined,
  province: enumFromValueString(queryUser.province, Province),
  dateOfBirth: new Date(queryUser.dateOfBirth),
  status: enumFromKeyString(queryUser.status, UserStatus),
});

const useUserDetailsQuery = generateQueryHook<UserQueryVariables, UserQuery>(
  userDetailsQuery,
);

const useUserDetailsLazyQuery = generateLazyQueryHook<
  UserQueryVariables,
  UserQuery
>(userDetailsQuery);

export { mapToUser, useUserDetailsLazyQuery, useUserDetailsQuery };
