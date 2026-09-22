type RequestInformation = {
  apiType: API;
  method: string;
  url: URL;
};

type Message = {
  message: string;
};

export const unhandledRequest = (info: RequestInformation): Message => ({
  message: `A test is making a ${info.apiType} ${info.method} request to ${info.url}. Make sure to declare the handler using the \`intercept\` helper in the test!`,
});

export enum HTTP {
  UNACCEPTABLE = 406,
}

export enum API {
  REST = 'rest',
  GraphQL = 'graphql',
}
