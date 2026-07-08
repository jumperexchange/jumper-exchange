/**
 * Single source of Sentry cost and filtering behavior for client, server, and edge.
 *
 * Cost policy (production defaults; override with env when needed):
 * - Traces: 10% sample (set NEXT_PUBLIC_SENTRY_TRACES_SAMPLE or SENTRY_TRACES_SAMPLE)
 * - Replay: no session replays in prod; on-error replay at 20% (NEXT_PUBLIC_SENTRY_REPLAY_ON_ERROR)
 * - Logs: Sentry "logs" and console-to-Sentry disabled in production unless enabled explicitly
 *
 * Env (all optional; build must still provide NEXT_PUBLIC_SENTRY_DSN to enable the browser SDK):
 * - NEXT_PUBLIC_SENTRY_TRACES_SAMPLE: 0–1, client transaction sample rate
 * - SENTRY_TRACES_SAMPLE: 0–1, server/edge (not exposed to the browser)
 * - NEXT_PUBLIC_SENTRY_REPLAY_SESSION: 0–1, session replay sample (0 in prod by default)
 * - NEXT_PUBLIC_SENTRY_REPLAY_ON_ERROR: 0–1, replay when an error occurs
 * - NEXT_PUBLIC_SENTRY_ENABLE_LOGS: "true" to send enableLogs in production
 * - NEXT_PUBLIC_SENTRY_CONSOLE: "true" to forward console to Sentry in production
 * - SENTRY_SPOTLIGHT: "true" to enable server-side Spotlight in non-production (requires local Spotlight)
 *
 * `beforeSend` is typed from `import('@sentry/nextjs').init` so we never import
 * `@sentry/core` directly (pnpm may not link it for application sources).
 */
import type { init } from '@sentry/nextjs';
import { isProduction } from '@/utils/isProduction';

type SentryInitOptions = NonNullable<Parameters<typeof init>[0]>;
type SentryBeforeSend = NonNullable<SentryInitOptions['beforeSend']>;

const PROD_TRACES = 0.1;
const DEV_TRACES = 1.0;
const PROD_REPLAY_SESSION = 0;
const PROD_REPLAY_ON_ERROR = 0.2;
const DEV_REPLAY_SESSION = 1.0;
const DEV_REPLAY_ON_ERROR = 0.4;

const DEFAULT_IGNORE_ERRORS: (string | RegExp)[] = [
  'ResizeObserver loop limit exceeded',
  'ResizeObserver loop completed with undelivered notifications',
  'Non-Error exception captured with keys',
  'AbortError',
  'The operation was aborted',
  'cancelled',
  'Loading chunk',
  'Failed to fetch',
  'NetworkError',
  'Edge case: Missing window',
  /^Script error\.?$/i,
  /^chrome-extension:\/\//i,
  /^moz-extension:\/\//i,
];

const DEFAULT_DENY_URLS: (string | RegExp)[] = [
  /chrome-extension:\//i,
  /moz-extension:\//i,
  /extensions\//i,
  /graph\.facebook\.com/i,
  /connect\.facebook\.net\/en_US\/all\.js/i,
];

function parseSampleRate(value: string | undefined, fallback: number): number {
  if (value === undefined || value === '') {
    return fallback;
  }
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 && n <= 1 ? n : fallback;
}

function isStorybookOrTest(): boolean {
  return (
    process.env.STORYBOOK === 'true' ||
    process.env.VITEST === 'true' ||
    process.env.NEXT_PUBLIC_STORYBOOK === 'true'
  );
}

function getTracesSampleRate(isClient: boolean, prod: boolean): number {
  if (!prod) {
    return parseSampleRate(
      isClient
        ? process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE
        : process.env.SENTRY_TRACES_SAMPLE,
      DEV_TRACES,
    );
  }
  if (isClient) {
    return parseSampleRate(
      process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE,
      PROD_TRACES,
    );
  }
  return parseSampleRate(process.env.SENTRY_TRACES_SAMPLE, PROD_TRACES);
}

export type SentryRuntime = 'client' | 'server' | 'edge';

export type SentryBaseOptions = {
  dsn: string | undefined;
  enabled: boolean;
  environment: string;
  debug: boolean;
  tracesSampleRate: number;
  enableLogs: boolean;
  ignoreErrors: (string | RegExp)[];
  denyUrls: (string | RegExp)[];
  maxBreadcrumbs: number;
  beforeSend: SentryBeforeSend;
};

export type SentryClientReplayOptions = {
  replaysOnErrorSampleRate: number;
  replaysSessionSampleRate: number;
};

const beforeSendError: SentryBeforeSend = (event, _hint) => {
  const msg = event.message?.toLowerCase() ?? '';
  if (msg.includes('failed to load resource')) {
    return null;
  }
  if (msg.includes('network request failed') && event.exception == null) {
    return null;
  }
  return event;
};

export function getSentryBaseOptions(
  runtime: SentryRuntime,
  options?: { isProd: boolean },
): SentryBaseOptions {
  const prod = options?.isProd ?? isProduction;
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  const off = isStorybookOrTest();
  const isClient = runtime === 'client';
  const tracesSampleRate = getTracesSampleRate(isClient, prod);

  const enableLogs = prod
    ? process.env.NEXT_PUBLIC_SENTRY_ENABLE_LOGS === 'true'
    : true;

  return {
    dsn,
    enabled: !!dsn && !off,
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
    debug: !prod,
    tracesSampleRate,
    enableLogs,
    ignoreErrors: DEFAULT_IGNORE_ERRORS,
    denyUrls: DEFAULT_DENY_URLS,
    maxBreadcrumbs: 50,
    beforeSend: beforeSendError,
  };
}

export function getSentryClientReplaySampleRates(options?: {
  isProd: boolean;
}): SentryClientReplayOptions {
  const prod = options?.isProd ?? isProduction;
  return {
    replaysOnErrorSampleRate: prod
      ? parseSampleRate(
          process.env.NEXT_PUBLIC_SENTRY_REPLAY_ON_ERROR,
          PROD_REPLAY_ON_ERROR,
        )
      : parseSampleRate(
          process.env.NEXT_PUBLIC_SENTRY_REPLAY_ON_ERROR,
          DEV_REPLAY_ON_ERROR,
        ),
    replaysSessionSampleRate: prod
      ? parseSampleRate(
          process.env.NEXT_PUBLIC_SENTRY_REPLAY_SESSION,
          PROD_REPLAY_SESSION,
        )
      : parseSampleRate(
          process.env.NEXT_PUBLIC_SENTRY_REPLAY_SESSION,
          DEV_REPLAY_SESSION,
        ),
  };
}

export function shouldSendConsoleToSentryInProduction(): boolean {
  return process.env.NEXT_PUBLIC_SENTRY_CONSOLE === 'true';
}
