import {
  type MockedResponse,
  type ResponseComposition,
  type RestRequest,
  type RestContext,
} from 'msw';
import { rest } from 'msw';

import { API, unhandledRequest } from './shared';

type Response = MockedResponse | Promise<MockedResponse>;

export type Request = RestRequest;

export type Context = RestContext;

export const handlers = (
  controller: (
    request: Request,
    response: ResponseComposition,
    context: Context,
  ) => Response,
) => [
  // NOTE: the TRACE and CONNECT methods are not supported by MSW ¯\_(ツ)_/¯
  rest.delete(/./, controller),
  rest.get(/./, controller),
  rest.head(/./, controller),
  rest.options(/./, controller),
  rest.patch(/./, controller),
  rest.post(/./, controller),
  rest.put(/./, controller),
];

export const response = (request: Request, context: Context) => {
  const unhandledRequestResponse = unhandledRequest({
    apiType: API.REST,
    url: request.url,
    method: request.method,
  });

  // eslint-disable-next-line no-console
  console.error(unhandledRequestResponse.message);

  return context.json(unhandledRequestResponse);
};
