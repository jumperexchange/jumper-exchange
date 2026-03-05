// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import {
  init,
  addIntegration,
  consoleLoggingIntegration,
  browserTracingIntegration,
  getClient,
  captureRouterTransitionStart,
} from '@sentry/nextjs';
import { isProduction } from './src/utils/isProduction';
import './src/utils/instrumentation/lifiSdkConfig';

init({
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: isProduction ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: !isProduction,

  replaysOnErrorSampleRate: 0.4,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: isProduction ? 0.4 : 1.0,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  integrations: [
    // send console.log, console.warn, and console.error calls as logs to Sentry
    consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
    browserTracingIntegration(),
  ],
});

if (typeof window !== 'undefined') {
  window.addEventListener('load', async () => {
    const { replayIntegration } = await import('@sentry/nextjs');
    addIntegration(
      replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    );
  });
}

// Log Sentry initialization status
const client = getClient();
console.log('[Sentry Client] Initialized:', {
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN
    ? '✓ DSN configured'
    : '✗ DSN missing',
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
  isClientActive: !!client,
});

export const onRouterTransitionStart = captureRouterTransitionStart;
