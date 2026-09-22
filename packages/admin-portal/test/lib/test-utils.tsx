import { ThemeProvider } from '@mui/material/styles';
import { renderHook, render } from '@testing-library/react';
import {
  type PropsWithChildren,
  type ReactElement,
  type Provider,
} from 'react';
import { useMemo } from 'react';
import { SnackbarProvider } from 'notistack';
import { getApolloContext } from '@apollo/client';

import { LightTheme } from '@neofinancial/morpheus-theme-light';
import { FeatureFlagProvider as RemoteFeatureFlagProvider } from '@neofinancial/neo-configcat';

import { EmotionRegistry } from '../../src/styles/emotion-registry';
import { RemoteFlagsEnum, type RemoteFlags } from '../../src/lib/remote-flags';
import { buildTestClient } from './apollo-mock';

interface TestRemoteFeatureFlagProviderProps {
  featureFlagsOverrides?: Partial<RemoteFlags>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface TestProvider<T = PropsWithChildren<any>> {
  Provider: Provider<T>;
  props: T;
}

interface TestOverrideProviderProps extends TestRemoteFeatureFlagProviderProps {
  additionalProviders?: TestProvider[];
}

const TestRemoteFeatureFlagProvider = ({
  children,
  featureFlagsOverrides = {},
}: PropsWithChildren<TestRemoteFeatureFlagProviderProps>): ReactElement => {
  const flagsObject: Record<string, boolean | string | number> = {
    ...featureFlagsOverrides,
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const flag of Object.values(RemoteFlagsEnum)) {
    flagsObject[flag] = flagsObject[flag] ?? true;
  }

  return (
    <RemoteFeatureFlagProvider flags={flagsObject}>
      {children}
    </RemoteFeatureFlagProvider>
  );
};

const TestApolloProvider = ({ children }: PropsWithChildren): ReactElement => {
  const apolloContext = getApolloContext();

  const testClient = useMemo(() => {
    const client = buildTestClient();

    return { client };
  }, []);

  return (
    <apolloContext.Provider value={testClient}>
      {children}
    </apolloContext.Provider>
  );
};

const AdditionalProviders = ({
  additionalProviders,
  children,
}: PropsWithChildren<TestOverrideProviderProps>): ReactElement => {
  if (!additionalProviders) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  const [{ Provider, props }, ...remainingProviders] = additionalProviders;

  return (
    <Provider {...props}>
      {remainingProviders && remainingProviders.length > 0 ? (
        <AdditionalProviders {...remainingProviders}>
          {children}
        </AdditionalProviders>
      ) : (
        children
      )}
    </Provider>
  );
};

const TestProviders = ({
  children,
  featureFlagsOverrides,
  additionalProviders,
}: PropsWithChildren<TestOverrideProviderProps>): ReactElement => (
  <EmotionRegistry options={{ key: 'mui' }}>
    <ThemeProvider theme={LightTheme}>
      <SnackbarProvider
        maxSnack={1}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      >
        <TestApolloProvider>
          <TestRemoteFeatureFlagProvider
            featureFlagsOverrides={featureFlagsOverrides}
          >
            <AdditionalProviders {...{ additionalProviders }}>
              {children}
            </AdditionalProviders>
          </TestRemoteFeatureFlagProvider>
        </TestApolloProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </EmotionRegistry>
);

const renderWithProviders = (
  ui: JSX.Element,
  overrides: TestRemoteFeatureFlagProviderProps = {},
) => {
  const wrapper = ({ children }: PropsWithChildren): ReactElement => (
    <TestProviders {...overrides}>{children}</TestProviders>
  );

  return render(ui, { wrapper });
};
const renderHookWithProviders = <TProps, TResult>(
  callback: (props: TProps) => TResult,
  overrides: TestOverrideProviderProps = {},
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrapper = ({ children }: PropsWithChildren): any => (
    <TestProviders {...overrides}>{children}</TestProviders>
  );

  return renderHook<TResult, TProps>(callback, { wrapper });
};

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { renderWithProviders, renderHookWithProviders };
