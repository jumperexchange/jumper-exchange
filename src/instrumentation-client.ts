// This file configures the initialization of Sentry on the client.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import {
  init,
  addIntegration,
  consoleLoggingIntegration,
  browserTracingIntegration,
  getClient,
  captureRouterTransitionStart,
} from '@sentry/nextjs';
import { isProduction } from '@/utils/isProduction';
import {
  getSentryBaseOptions,
  getSentryClientReplaySampleRates,
  shouldSendConsoleToSentryInProduction,
} from '@/sentry/sharedOptions';
import '@/utils/instrumentation/lifiSdkConfig';

const base = getSentryBaseOptions('client');
const replay = getSentryClientReplaySampleRates();

const clientIntegrations = [browserTracingIntegration()];

if (!isProduction || shouldSendConsoleToSentryInProduction()) {
  clientIntegrations.push(
    consoleLoggingIntegration({
      levels: isProduction ? ['error'] : ['log', 'warn', 'error'],
    }),
  );
}

init({
  ...base,
  ...replay,
  integrations: clientIntegrations,
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

if (base.debug) {
  const client = getClient();

  console.log('[Sentry Client] Initialized:', {
    enabled: base.enabled,
    dsn: base.dsn ? 'configured' : 'missing',
    environment: base.environment,
    isClientActive: !!client,
  });
}

export const onRouterTransitionStart = captureRouterTransitionStart;
