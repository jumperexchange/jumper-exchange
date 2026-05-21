export const initPrometheusRegistry = async () => {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  if (global.prometheusRegistry) {
    return;
  }

  try {
    const { Registry, collectDefaultMetrics } = await import('prom-client');
    const registry = new Registry();
    collectDefaultMetrics({ register: registry });
    global.prometheusRegistry = registry;
    console.log('Prometheus metrics initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Prometheus:', error);
  }
};
