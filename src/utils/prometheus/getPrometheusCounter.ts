import type { Counter } from 'prom-client';
import * as client from 'prom-client';
import type { ErrorOperation } from '@/utils/prometheus/errorOperations';

const METRIC_NAME = 'custom_error_metric';
const APP_NAME = 'jumper-exchange';

export const getPrometheusCounter = (): Counter<string> | undefined => {
  const registry = global.prometheusRegistry;
  if (!registry) {
    return undefined;
  }

  const existingCounter = registry.getSingleMetric(METRIC_NAME);
  if (existingCounter) {
    return existingCounter as Counter<string>;
  }

  try {
    return new client.Counter({
      name: METRIC_NAME,
      help: 'Tracks the number of errors.',
      labelNames: ['app', 'operation'],
      registers: [registry],
    });
  } catch (error) {
    console.error(error, 'Error creating Prometheus counter.');
    return undefined;
  }
};

export const incrementPrometheusErrorCounter = (
  operation: ErrorOperation = 'unknown',
) => {
  const counter = getPrometheusCounter();
  counter?.inc({
    app: APP_NAME,
    operation,
  });
};
