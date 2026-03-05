// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { init, getClient } from '@sentry/nextjs';
import { isProduction } from './src/utils/isProduction';

init({
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: isProduction ? 0.4 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: !isProduction,
});

// Log Sentry initialization status
const client = getClient();
console.log('[Sentry Edge] Initialized:', {
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN
    ? '✓ DSN configured'
    : '✗ DSN missing',
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
  isClientActive: !!client,
});
