/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthorizationRole, GraphQLRequestContext, ObjectId } from '@neofinancial/neo-framework';
import merge from 'lodash/merge';

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

// NOTE: This context plugin is NOT used in the neo code base; this is required in this project to add in user context as there is no login functionality
const contextPlugin = {
  requestDidStart: async (requestContext: Writeable<GraphQLRequestContext<any>>): Promise<any | void> => {
    requestContext.contextValue = merge(requestContext.contextValue, {
      roles: [AuthorizationRole.CUSTOMER_OPS],
      adminId: new ObjectId().toHexString(),
    });
  },
};

export { contextPlugin };
