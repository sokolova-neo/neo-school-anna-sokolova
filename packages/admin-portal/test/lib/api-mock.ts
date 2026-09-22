/* eslint-disable @typescript-eslint/no-explicit-any */
import { type GraphQLError } from 'graphql/error/GraphQLError';
import { type GraphQLRequest, GraphQLVariables } from 'msw';
import { graphql } from 'msw';
import { server } from './msw-server';

// import { server } from '../mocks';

export type InterceptorFunction = (
  request: GraphQLRequest<GraphQLVariables>,
) => void;

interface BaseMockApiOptions {
  /**
   * Function that will be called with the request variables.
   */
  requestInterceptor?: InterceptorFunction;
}

interface SuccessMockAPIOptions extends BaseMockApiOptions {
  /**
   * Override the key for the response.
   */
  responseKey?: string;

  /**
   * Allows you to pass the whole result object
   */
  rawResult?: boolean;
}

const callInterceptor = (
  request: GraphQLRequest<GraphQLVariables>,
  options?: BaseMockApiOptions,
) => {
  if (typeof options?.requestInterceptor === 'function') {
    options.requestInterceptor(request);
  }
};

export const mockQuerySuccess = <TResult extends Record<string, any>>(
  queryName: string,
  result: TResult,
  options?: SuccessMockAPIOptions,
) => {
  server.use(
    graphql.query(queryName, (request, response, context) => {
      callInterceptor(request, options);

      return response(
        context.data(
          options?.rawResult
            ? result
            : {
                [options?.responseKey ?? queryName]: result,
              },
        ),
      );
    }),
  );
};

export const mockQueryError = <TError extends Partial<GraphQLError>>(
  queryName: string,
  errors?: [TError],
  options?: BaseMockApiOptions,
) => {
  const defaultErrors = [{ message: 'this is a query error' }];
  const responseErrors = errors ?? defaultErrors;

  server.use(
    graphql.query(queryName, (request, response, context) => {
      callInterceptor(request, options);

      return response(context.errors(responseErrors));
    }),
  );
};

export const mockMutationSuccess = <TResult extends Record<string, any>>(
  queryName: string,
  result: TResult,
  options?: SuccessMockAPIOptions,
) => {
  server.use(
    graphql.mutation(queryName, (request, response, context) => {
      callInterceptor(request, options);

      return response(
        context.data(
          options?.rawResult
            ? result
            : {
                [options?.responseKey ?? queryName]: result,
              },
        ),
      );
    }),
  );
};

export const mockMutationError = <TError extends Partial<GraphQLError>>(
  queryName: string,
  errors?: [TError],
  options?: BaseMockApiOptions,
) => {
  const defaultErrors = [{ message: 'this is a mutation error' }];
  const responseErrors = errors ?? defaultErrors;

  server.use(
    graphql.mutation(queryName, (request, response, context) => {
      callInterceptor(request, options);

      return response(context.errors(responseErrors));
    }),
  );
};
