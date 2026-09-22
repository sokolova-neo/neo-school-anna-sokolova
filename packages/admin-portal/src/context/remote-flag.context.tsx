import { type PropsWithChildren, type ReactElement } from 'react';

import {
  FeatureFlagProvider,
  useFeatureFlag,
} from '@neofinancial/neo-configcat';

import {
  getFallbackFlags,
  type FeatureFlags,
  type RemoteFlags,
} from '../lib/remote-flags';

function RemoteFeatureFlagProvider({
  children,
}: PropsWithChildren): ReactElement {
  return (
    <FeatureFlagProvider flags={getFallbackFlags()}>
      {children}
    </FeatureFlagProvider>
  );
}

function useRemoteFlag<T extends FeatureFlags = RemoteFlags>(): T {
  return useFeatureFlag<T>();
}

export { RemoteFeatureFlagProvider, useRemoteFlag };
