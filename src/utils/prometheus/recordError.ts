import type { ErrorOperation } from '@/utils/prometheus/errorOperations';
import { incrementPrometheusErrorCounter } from '@/utils/prometheus/getPrometheusCounter';

type RecordErrorParams = {
  operation: ErrorOperation;
  source: 'server' | 'client';
};

export const recordServerError = (operation: ErrorOperation) => {
  incrementPrometheusErrorCounter(operation);
};

export const recordClientError = async (operation: ErrorOperation) => {
  try {
    await fetch('/api/prom-counter-increase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation }),
    });
  } catch (error) {
    console.error(error, 'Error recording prometheus error metric.');
  }
};

export const recordError = ({ operation, source }: RecordErrorParams) => {
  if (source === 'server') {
    recordServerError(operation);
    return Promise.resolve();
  }

  return recordClientError(operation);
};
