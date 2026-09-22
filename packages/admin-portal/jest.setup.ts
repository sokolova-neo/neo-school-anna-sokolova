import '@testing-library/jest-dom/extend-expect';
import { TextDecoder } from 'util';

import failOnConsole from 'jest-fail-on-console';
import { setupMswServer } from './test/lib/msw-server';
import { mockNextDynamic } from './test/next/dynamic-mock';
import { mockNextImage } from './test/next/image-mock';
import { mockNextLink } from './test/next/link-mock';
import { mockUseRouter } from './test/next/router-mock';

jest.setTimeout(60_000);

// Next mocks
mockUseRouter();
mockNextLink();
mockNextImage();
mockNextDynamic();

// msw
setupMswServer();

if (!global.TextDecoder) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global.TextDecoder = TextDecoder as any;
}

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

afterAll(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

const logMessagesToIgnore = [
  /**
   * This is an ongoing issue with jest-environment-jsdom and CSSOM
   *
   * @see https://github.com/facebook/jest/issues/13315
   * @see https://github.com/jsdom/jsdom/issues/3452
   */
  'Warning: [JSS] CSSOM.parse is not a function',
];

jest.spyOn(global.console, 'warn').mockImplementation((message) => {
  if (!logMessagesToIgnore.includes(message)) {
    // eslint-disable-next-line no-console
    console.warn(message);
  }
});

// Fail tests on console.error or console.warn
failOnConsole({
  shouldFailOnError: true,
  shouldFailOnWarn: true,
  // Can add exceptions by returning true in here
  silenceMessage: (errorMessage) => {
    if (logMessagesToIgnore.includes(errorMessage)) {
      return true;
    }

    return false;
  },
});
