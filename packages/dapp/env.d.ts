/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly DEV: boolean;
  readonly MODE: 'development' | 'testnet' | 'production' | 'staging';
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly VITE_ARCX_API_KEY: string;
  readonly VITE_GOOGLE_ANALYTICS_TRACKING_ID: string;
  readonly VITE_HOTJAR_ID: number;
  readonly VITE_HOTJAR_SNIPPET_VERSION: number;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_CUSTOM_RPCS: string;
  readonly VITE_WIDGET_INTEGRATOR: string;
  readonly VITE_LIFI_API_URL: string;
  readonly VITE_ONRAMPER_ENABLED: string;
  readonly VITE_CONTENTFUL_API_URL: string;
  readonly VITE_CONTENTFUL_PREVIEW_API_URL: string;
  readonly VITE_CONTENTFUL_SPACE_ID: string;
  readonly VITE_CONTENTFUL_ACCESS_TOKEN: string;
  readonly VITE_CONTENTFUL_PREVIEW_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
