import { DocumentNode, gql } from '@neofinancial/neo-framework';

const getExternalSchema = (): DocumentNode => gql`
  extend type User @key(fields: "id") {
    id: ObjectID! @external
  }
`;

export { getExternalSchema };
