export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
    const { initPrometheusRegistry } =
      await import('./src/utils/prometheus/initPrometheusRegistry');
    await initPrometheusRegistry();
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }

  await import('./src/utils/instrumentation/lifiSdkConfig');
}

export { onRequestError } from './src/utils/prometheus/onRequestError';
