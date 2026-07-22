// This file works on both server and client automatically

export interface RuntimeConfig {
  [key: string]: string;
}

declare global {
  interface Window {
    _env_: RuntimeConfig;
  }
}

let config: RuntimeConfig;

export function getEnvVars(): RuntimeConfig {
  if (typeof window !== 'undefined') {
    throw new Error('getEnvVars is not available on the client');
  }

  return process.env as RuntimeConfig;
}

export function getPublicEnvVars(): RuntimeConfig {
  if (typeof window !== 'undefined') {
    throw new Error('getPublicEnvVars is not available on the client');
  }

  return Object.keys(process.env)
    .filter((key) => key.startsWith('NEXT_PUBLIC_'))
    .reduce<RuntimeConfig>((acc, key) => {
      acc[key] = process.env[key] ?? '';
      return acc;
    }, {});
}

// Build-time fallback for the client: Next.js statically replaces each
// process.env.NEXT_PUBLIC_* reference at build time, so these values are
// baked into the bundle. They serve as a fallback when window._env_ is not
// set (e.g. RSC streaming prevents the inline <script> tag from executing).
const clientBuildTimeEnv: RuntimeConfig = {
  NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT ?? '',
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? '',
  NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID:
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID ?? '',
  NEXT_PUBLIC_LIFI_BACKEND_URL: process.env.NEXT_PUBLIC_LIFI_BACKEND_URL ?? '',
  NEXT_PUBLIC_WIDGET_INTEGRATOR:
    process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR ?? '',
  NEXT_PUBLIC_WIDGET_INTEGRATOR_REFUEL:
    process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR_REFUEL ?? '',
  NEXT_PUBLIC_WIDGET_INTEGRATOR_BLOG:
    process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR_BLOG ?? '',
  NEXT_PUBLIC_ADDRESSABLE_TID: process.env.NEXT_PUBLIC_ADDRESSABLE_TID ?? '',
  NEXT_PUBLIC_CUSTOM_RPCS: process.env.NEXT_PUBLIC_CUSTOM_RPCS ?? '{}',
  NEXT_PUBLIC_DKEY: process.env.NEXT_PUBLIC_DKEY ?? '',
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL ?? '',
  NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL ?? '',
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID:
    process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? '',
  NEXT_PUBLIC_LIFI_API_KEY: process.env.NEXT_PUBLIC_LIFI_API_KEY ?? '',
  NEXT_PUBLIC_SOLANA_RPC_URI: process.env.NEXT_PUBLIC_SOLANA_RPC_URI ?? '',
  NEXT_PUBLIC_SPINDL_API_KEY: process.env.NEXT_PUBLIC_SPINDL_API_KEY ?? '',
  NEXT_PUBLIC_SPINDL_API_URL: process.env.NEXT_PUBLIC_SPINDL_API_URL ?? '',
  NEXT_PUBLIC_INTERCOM_APP_ID: process.env.NEXT_PUBLIC_INTERCOM_APP_ID ?? '',
  NEXT_PUBLIC_WIDGET_INTEGRATOR_EARN:
    process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR_EARN ?? '',
  NEXT_PUBLIC_WIDGET_INTEGRATOR_LIMIT:
    process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR_LIMIT ?? '',
  NEXT_PUBLIC_WIDGET_INTEGRATOR_ADVANCED:
    process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR_ADVANCED ?? '',
  NEXT_PUBLIC_VERCEL_BRANCH_URL:
    process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL ?? '',
  NEXT_PUBLIC_NOTIFICATIONS_URL:
    process.env.NEXT_PUBLIC_NOTIFICATIONS_URL ?? '',
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN ?? '',
  NEXT_PUBLIC_LIFI_COMPOSER_BACKEND_URL:
    process.env.NEXT_PUBLIC_LIFI_COMPOSER_BACKEND_URL ?? '',
};

// Initialize config based on environment
if (typeof window === 'undefined') {
  // Server-side: read from process.env
  config = getEnvVars();
} else {
  // Client-side: prefer runtime window._env_ (set by layout script tag or
  // env-config.js API route), fall back to build-time values.
  config = new Proxy({} as RuntimeConfig, {
    get(_, prop: string) {
      return (window._env_ ?? clientBuildTimeEnv)[prop];
    },
    has(_, prop: string) {
      return prop in (window._env_ ?? clientBuildTimeEnv);
    },
    ownKeys() {
      return Object.keys(window._env_ ?? clientBuildTimeEnv);
    },
    getOwnPropertyDescriptor(_, prop: string) {
      const env = window._env_ ?? clientBuildTimeEnv;
      if (prop in env) {
        return { configurable: true, enumerable: true, value: env[prop] };
      }
      return undefined;
    },
  });
}

export default config;
