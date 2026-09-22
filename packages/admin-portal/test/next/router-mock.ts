import type * as Router from 'next/router';

const mockUseRouterInternal = jest.fn();

jest.mock('next/router', () => ({
  ...(jest.requireActual('next/router') as Object),
  useRouter: mockUseRouterInternal,
}));

export function mockUseRouter(props: Partial<Router.NextRouter> = {}) {
  return mockUseRouterInternal.mockImplementation(() => ({
    route: props.route ?? '',
    pathname: props.pathname ?? '',
    query: props.query ?? {},
    asPath: props.asPath ?? '',
    basePath: props.basePath ?? '',
    defaultLocale: props.defaultLocale,
    domainLocales: props.domainLocales,
    isLocaleDomain: true,
    isPreview: false,
    locale: props.locale || 'en-CA',
    locales: props.locales,
    push: props.push ?? jest.fn(),
    replace: props.replace ?? jest.fn(),
    reload: props.reload ?? jest.fn(),
    back: props.back ?? jest.fn(),
    prefetch: props.prefetch ?? jest.fn(),
    beforePopState: props.beforePopState ?? jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      ...props.events,
    },
    isFallback: props.isFallback ?? false,
    isReady: props.isReady ?? true,
  }));
}
