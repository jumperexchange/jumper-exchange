import type { ErrorOperation } from '@/utils/telemetry/errorOperations';
import { incrementErrorMetric } from '@/utils/telemetry/recordErrorMetric';

type RecordErrorParams = {
  operation: ErrorOperation;
  source: 'server' | 'client';
};

export const recordServerError = (operation: ErrorOperation) => {
  incrementErrorMetric(operation);
};

export const recordClientError = async (operation: ErrorOperation) => {
  try {
    await fetch('/api/metrics/error-increment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation }),
    });
  } catch (error) {
    console.error(error, 'Error recording OpenTelemetry error metric.');
  }
};

export const recordError = ({ operation, source }: RecordErrorParams) => {
  if (source === 'server') {
    recordServerError(operation);
    return Promise.resolve();
  }

  return recordClientError(operation);
};
