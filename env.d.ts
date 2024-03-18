/// <reference types="vite/client" />

namespace NodeJS {
  interface ProcessEnv {
    BASE_URL: string;
    DEV: boolean;
    MODE: 'development' | 'testnet' | 'production' | 'staging';
    PROD: boolean;
    SSR: boolean;
    NEXT_PUBLIC_ARCX_API_KEY: string;
    NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID: string;
    NEXT_PUBLIC_HOTJAR_ID: number;
    NEXT_PUBLIC_HOTJAR_SNIPPET_VERSION: number;
    SENTRY_DSN: string;
    NEXT_PUBLIC_CUSTOM_RPCS: string;
    NEXT_PUBLIC_WIDGET_INTEGRATOR: string;
    NEXT_PUBLIC_LIFI_API_URL: string;
    NEXT_PUBLIC_ONRAMPER_ENABLED: string;
    NEXT_PRIVATE_STRAPI_DEVELOP: string;
    NEXT_PRIVATE_STRAPI_URL: string;
    NEXT_PRIVATE_STRAPI_API_TOKEN: string;
    NEXT_PRIVATE_STRAPI_LOCAL_URL: string;
    NEXT_PRIVATE_STRAPI_API_TOKEN: string;
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: string;
  }
}
