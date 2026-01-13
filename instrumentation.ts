import * as Sentry from '@sentry/nextjs';
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize structured logging (must happen before other imports)
    await import('pino');
    await import('next-logger');

    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }

  await import('./src/utils/instrumentation/lifiSdkConfig');
}

export const onRequestError = Sentry.captureRequestError;
