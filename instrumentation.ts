export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
    const { initOpenTelemetry } = await import('./instrumentation.node');
    initOpenTelemetry();
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }

  await import('./src/utils/instrumentation/lifiSdkConfig');
}

export { onRequestError } from './src/utils/telemetry/onRequestError';
