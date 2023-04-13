import { version } from '@lifi/widget';
import { CaptureConsole, HttpClient } from '@sentry/integrations';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initSentry = () => {
  Sentry.init({
    dsn: (import.meta.env as ImportMetaEnv).VITE_SENTRY_DSN,
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
    environment: (import.meta.env as ImportMetaEnv).MODE,
    enabled: (import.meta.env as ImportMetaEnv).PROD,
  });
};
