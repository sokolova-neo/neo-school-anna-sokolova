export interface PublicConfig {
  API_ENDPOINT: string; // Set in next config at runtime
  APP_ENV: string; // Set in env at buildtime
  FEATURE_FLAG_FALLBACK_NEO_ENABLED: boolean;
  URL: string;
}
