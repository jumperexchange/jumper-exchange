/// <reference types="vite/client" />

interface ImportMetaEnv {
  BASE_URL: string;
  DEV: boolean;
  MODE: 'development' | 'testnet' | 'production' | 'staging';
  PROD: boolean;
  SSR: boolean;
  readonly VITE_ARCX_API_KEY: string;
  readonly VITE_GOOGLE_ANALYTICS_TRACKING_ID: string;
  readonly VITE_HOTJAR_ID: number;
  readonly VITE_HOTJAR_SNIPPET_VERSION: number;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_CUSTOM_RPCS: string;
  readonly VITE_WIDGET_INTEGRATOR: string;
  readonly VITE_LIFI_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
