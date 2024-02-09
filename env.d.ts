/// <reference types="vite/client" />

namespace NodeJS {
  interface ProcessEnv {
    BASE_URL: string;
    DEV: boolean;
    MODE: 'development' | 'testnet' | 'production' | 'staging';
    PROD: boolean;
    SSR: boolean;
    ARCX_API_KEY: string;
    GOOGLE_ANALYTICS_TRACKING_ID: string;
    HOTJAR_ID: number;
    HOTJAR_SNIPPET_VERSION: number;
    SENTRY_DSN: string;
    CUSTOM_RPCS: string;
    WIDGET_INTEGRATOR: string;
    LIFI_API_URL: string;
    ONRAMPER_ENABLED: string;
    STRAPI_DEVELOP: string;
    STRAPI_URL: string;
    STRAPI_API_TOKEN: string;
    LOCAL_STRAPI_URL: string;
    LOCAL_STRAPI_API_TOKEN: string;
    WALLET_CONNECT_PROJECT_ID: string;
  }
}
