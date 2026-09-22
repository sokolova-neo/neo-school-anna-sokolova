import publicConfig from '../../public/config.json';

/**
 * All available feature flags and their types in alphabetical order
 */
export type RemoteFlags = {
  NEO_ENABLED: boolean;
};

/**
 * All available feature flags enumerations in alphabetical order
 */
export enum RemoteFlagsEnum {
  NEO_ENABLED = 'NEO_ENABLED',
}

export type FeatureFlags = Record<string, string | number | boolean>;

export type ConfigCatFlags<T extends FeatureFlags> = {
  settingKey: keyof T;
  settingValue: T[keyof T];
};

function getFallbackFlags<T extends FeatureFlags>(): T {
  const flags = Object.create(null);
  const remoteFlagsKeys = Object.values(RemoteFlagsEnum);

  // eslint-disable-next-line no-restricted-syntax
  for (const flagKey of remoteFlagsKeys) {
    flags[flagKey] = publicConfig[`FEATURE_FLAG_FALLBACK_${flagKey}`];
  }

  return flags;
}

export { getFallbackFlags };
