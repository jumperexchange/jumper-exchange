// This file configures the initialization of Sentry on the server.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { init, getClient } from '@sentry/nextjs';
import { isProduction } from './src/utils/isProduction';
import { getSentryBaseOptions } from './src/sentry/sharedOptions';

const base = getSentryBaseOptions('server');

// Spotlight only when explicitly enabled — otherwise it hammers a local endpoint and logs:
// "[Spotlight] Disabled Sentry -> Spotlight integration due to too many failed requests"
init({
  ...base,
  spotlight: !isProduction && process.env.SENTRY_SPOTLIGHT === 'true',
});

if (base.debug) {
  const client = getClient();

  console.log('[Sentry Server] Initialized:', {
    enabled: base.enabled,
    dsn: base.dsn ? 'configured' : 'missing',
    environment: base.environment,
    isClientActive: !!client,
  });
}
