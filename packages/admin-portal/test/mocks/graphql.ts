import {
  type MockedResponse,
  type GraphQLContext,
  type GraphQLRequest,
  type GraphQLVariables,
  type GraphQLHandler,
  type ResponseComposition,
} from 'msw';
import { graphql } from 'msw';

import { API, unhandledRequest } from './shared';

type Response = MockedResponse | Promise<MockedResponse>;

export type Request = GraphQLRequest<GraphQLVariables>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Context = GraphQLContext<Record<string, any>>;

export const handlers = (
  resolver: (
    request: Request,
    response: ResponseComposition,
    context: Context,
  ) => Response,
): GraphQLHandler<Request>[] => [
  graphql.mutation(/./, resolver),
  graphql.query(/./, resolver),
];

export const response = (request: Request, context: Context) => {
  const method = request.body && 'query' in request.body ? 'query' : 'mutation';
  const unhandledRequestResponse = unhandledRequest({
    apiType: API.GraphQL,
    url: request.url,
    method: `${request.method} || 'anonymous'} ${method}`,
  });

  // eslint-disable-next-line no-console
  console.error(unhandledRequestResponse.message);

  return context.errors([unhandledRequestResponse]);
};
