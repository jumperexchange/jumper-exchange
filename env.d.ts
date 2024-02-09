/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly DEV: boolean;
  readonly MODE: 'development' | 'testnet' | 'production' | 'staging';
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly ARCX_API_KEY: string;
  readonly GOOGLE_ANALYTICS_TRACKING_ID: string;
  readonly HOTJAR_ID: number;
  readonly HOTJAR_SNIPPET_VERSION: number;
  readonly SENTRY_DSN: string;
  readonly CUSTOM_RPCS: string;
  readonly WIDGET_INTEGRATOR: string;
  readonly LIFI_API_URL: string;
  readonly ONRAMPER_ENABLED: string;
  readonly STRAPI_DEVELOP: string;
  readonly STRAPI_URL: string;
  readonly STRAPI_API_TOKEN: string;
  readonly LOCAL_STRAPI_URL: string;
  readonly LOCAL_STRAPI_API_TOKEN: string;
  readonly WALLET_CONNECT_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
