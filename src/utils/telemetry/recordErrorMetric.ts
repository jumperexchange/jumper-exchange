import { metrics } from '@opentelemetry/api';
import type { ErrorOperation } from '@/utils/telemetry/errorOperations';

const METER_NAME = 'jumper-exchange';
const METRIC_NAME = 'custom_error_metric';
// Separate from METER_NAME: this is a metric attribute, not the instrumentation scope name.
const APP_NAME = 'jumper-exchange';

export const incrementErrorMetric = (operation: ErrorOperation = 'unknown') => {
  try {
    metrics
      .getMeter(METER_NAME)
      .createCounter(METRIC_NAME, {
        description: 'Tracks the number of errors.',
      })
      .add(1, { app: APP_NAME, operation });
  } catch (error) {
    console.error(error, 'Error recording OpenTelemetry error metric.');
  }
};
