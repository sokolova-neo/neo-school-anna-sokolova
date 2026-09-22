import { DocumentNode, gql } from '@neofinancial/neo-framework';

const getUserSchema = (): DocumentNode => gql`
  type User @key(fields: "id") {
    id: ObjectID!
    email: String!
    phone: String!
    firstName: String!
    lastName: String!
    preferredName: String
    province: Province!
    dateOfBirth: Date!
    status: UserStatus!
  }

  enum Province {
    AB
    BC
    MB
    NB
    NL
    NT
    NS
    NU
    ON
    PE
    QC
    SK
    YT
  }

  enum UserStatus {
    ACTIVE
    INACTIVE
    FROZEN
    PENDING
  }

  input UpdateUserDetailsInput {
    userId: ObjectID!
    firstName: String
    lastName: String
    preferredName: String
    province: Province
  }

  input UpdateUserContactInput {
    userId: ObjectID!
    phone: String
    email: String
  }

  type UpdateUserDetailsResponse {
    user: User!
  }

  type UpdateUserContactResponse {
    user: User!
  }

  extend type Mutation {
    updateUserDetails(input: UpdateUserDetailsInput!): UpdateUserDetailsResponse!
    updateUserContact(input: UpdateUserContactInput!): UpdateUserContactResponse!
  }

  extend type Query {
    user(id: ObjectID!): User!
  }
`;

export { getUserSchema };
