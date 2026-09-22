/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type RestRequest,
  type ResponseComposition,
  type RestContext,
  type GraphQLContext,
  type GraphQLRequest,
  type GraphQLVariables,
} from 'msw';
import { rest, graphql } from 'msw';
import { setupServer } from 'msw/node';

import { testCache } from './apollo-mock';
import { HttpStatusCode } from '../../src/types/http-server-code';

const isRestContext = (
  ctx: RestContext | GraphQLContext<Record<string, any>>,
): ctx is RestContext => 'json' in ctx && typeof ctx.json === 'function';

const handlerResponseMessage = (params: {
  apiType: 'rest' | 'graphql';
  url: URL;
  method: string;
}): { message: string } => ({
  message: `The test is making a ${params.apiType} ${params.method} call to ${params.url}. Make sure to declare the handler using server.use in the test.`,
});

const restResponse = (req: any, ctx: any) => {
  const response = handlerResponseMessage({
    apiType: 'rest',
    url: req.url,
    method: req.method,
  });

  // eslint-disable-next-line no-console
  console.error(response.message);

  return ctx.json(response);
};

const graphqlResponse = (req: any, ctx: any) => {
  const method = 'query' in req.body ? 'query' : 'mutation';

  const response = handlerResponseMessage({
    apiType: 'graphql',
    url: req.url,
    method: `${req.body.operationName} ${method}`,
  });

  // eslint-disable-next-line no-console
  console.error(response.message);

  return ctx.errors([response]);
};

const handlerResponse = (
  req: RestRequest | GraphQLRequest<GraphQLVariables>,
  res: ResponseComposition,
  ctx: RestContext | GraphQLContext<Record<string, unknown>>,
) => {
  const response = isRestContext(ctx)
    ? restResponse(req, ctx)
    : graphqlResponse(req, ctx);

  return res(ctx.status(HttpStatusCode.NOT_ACCEPTABLE), response);
};

// This handlers will block any request done during the unit tests
// So we avoid any leaking unnoticed request
// declaring server.use on the test file will overwrite those calls
const defaultHandlers = [
  graphql.mutation(/./, handlerResponse),
  graphql.query(/./, handlerResponse),
  rest.post(/./, handlerResponse),
  rest.get(/./, handlerResponse),
];

// Setup requests interception using the given handlers.
export const server = setupServer(...defaultHandlers);

export function setupMswServer() {
  beforeAll(() =>
    server.listen({
      onUnhandledRequest: 'error',
    }),
  );

  beforeEach(async () => {
    const handle = async () => {
      await testCache.reset();
      server.resetHandlers();
    };

    return handle();
  });

  afterAll(() => server.close());
}
