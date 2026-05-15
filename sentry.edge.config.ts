// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { init, getClient } from '@sentry/nextjs';
import { getSentryBaseOptions } from './src/sentry/sharedOptions';

const base = getSentryBaseOptions('edge');

init(base);

if (base.debug) {
  const client = getClient();

  console.log('[Sentry Edge] Initialized:', {
    enabled: base.enabled,
    dsn: base.dsn ? 'configured' : 'missing',
    environment: base.environment,
    isClientActive: !!client,
  });
}
