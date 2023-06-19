import { version } from '@lifi/widget';
import { BrowserTracing } from '@sentry/browser';
import { CaptureConsole, HttpClient } from '@sentry/integrations';
import * as Sentry from '@sentry/react';

export const initSentry = () => {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new CaptureConsole({
        levels: ['error'],
      }),
      new BrowserTracing(),
      new HttpClient({
        failedRequestStatusCodes: [
          [400, 499],
          [500, 599],
        ],
      }),
      new Sentry.Replay({
        maskAllInputs: false,
        maskAllText: false,
      }),
    ],
    sampleRate: 0.25,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.25,
    release: version,
    environment: import.meta.env.MODE,
    enabled: import.meta.env.PROD,
    ignoreErrors: [
      "MetaMask: 'eth_accounts' unexpectedly updated accounts.",
      'user rejected transaction',
    ],
  });
};
