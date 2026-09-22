import { gql } from '@apollo/client';

import { type User, UserStatus, Province } from '../../../types/user';
import {
  UserRelativeQueryFilterOperator,
  UserRelativeQuerySortDirection,
  UserRelativeQueryValueType,
} from '../../../types/__graphql/enums.generated.d';
import { generateQueryHook } from '../../../hooks/queries/generate-query-hook';
import { generateLazyQueryHook } from '../../../hooks/queries/generate-lazy-query-hook';
import { type RelativeCursorQueryInput } from '../../../hooks/use-relative-cursor-query';
import {
  enumFromValueString,
  enumFromKeyString,
} from '../../../lib/enum-helper';
import {
  type UsersQuery,
  type UsersQueryVariables,
} from './__graphql/use-users-query.generated.d';

const usersQuery = gql`
  query Users($input: UserRelativeQueryInput!) {
    users(input: $input) {
      results {
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
      hasNextPage
      primaryCursor {
        cursor
      }
      secondaryCursor {
        cursor
      }
    }
  }
`;

const mapToQueryInput = (
  input: RelativeCursorQueryInput,
): UsersQueryVariables['input'] => ({
  primaryCursor: {
    ...input.primaryCursor,
    sort: UserRelativeQuerySortDirection[input.primaryCursor.sort],
    type: UserRelativeQueryValueType[input.primaryCursor.type],
  },
  secondaryCursor: input.secondaryCursor
    ? {
        ...input.secondaryCursor,
        sort: UserRelativeQuerySortDirection[input.secondaryCursor.sort],
        type: UserRelativeQueryValueType[input.secondaryCursor.type],
      }
    : undefined,
  limit: input.limit,
  filter: input.filter?.map((filter) => ({
    ...filter,
    operator: UserRelativeQueryFilterOperator[filter.operator],
    type: UserRelativeQueryValueType[filter.type],
  })),
});

const mapToUser = (
  queryUser: UsersQuery['users']['results'][number],
): User => ({
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

const useUsersQuery = generateQueryHook<UsersQueryVariables, UsersQuery>(
  usersQuery,
);

const useUsersLazyQuery = generateLazyQueryHook<
  UsersQueryVariables,
  UsersQuery
>(usersQuery);

export { mapToUser, mapToQueryInput, useUsersLazyQuery, useUsersQuery };
