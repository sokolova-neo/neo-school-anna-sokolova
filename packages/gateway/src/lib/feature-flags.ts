import { isDevelopment, isTest } from '@neofinancial/neo-env';
import {
  featureFlagsClientFactory,
  buildTargetedFlagsObject,
  TargetedFlags as _TargetedFlags,
} from '@neofinancial/neo-feature-flags';

type FeatureFlags = {
  /**
   * While enabled (true), the gateway should try to write traffic logs to
   * traffic-collection-service. Otherwise it should operate without logging
   * traffic.
   */
  COLLECTING_TRAFFIC?: boolean;
};

type TargetedFlags = _TargetedFlags<FeatureFlags>;

let flags: FeatureFlags;
let targeted: TargetedFlags;

const setFlags = (updated: FeatureFlags): void => {
  flags = updated;
};

const setTargetedFlags = (updated: TargetedFlags): void => {
  targeted = updated;
};

const initializeFlags = async (defaults: FeatureFlags = {}): Promise<void> => {
  const client = featureFlagsClientFactory<FeatureFlags>(defaults, {
    onConfigChanged: setFlags,
    localMode: isDevelopment || isTest,
  });

  setFlags(await client.fetchRemoteFlags());
  setTargetedFlags(buildTargetedFlagsObject(client, defaults));
};

export { FeatureFlags, initializeFlags, setFlags, setTargetedFlags, flags, targeted };
