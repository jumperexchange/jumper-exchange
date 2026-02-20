import { chunk } from 'lodash';
import pLimit from 'p-limit';

export interface BatchFetcherConfig {
  /** Maximum items per batch (per API call) */
  maxPerBatch?: number;
  /** Maximum concurrent batch fetches */
  concurrency?: number;
}

export interface BatchFetcherCallbacks<TResult> {
  /** Called after each batch completes with cumulative results */
  onProgress?: (
    completedBatches: number,
    totalBatches: number,
    results: TResult[],
  ) => void;
  /** Called when all batches are complete */
  onComplete?: (results: TResult[]) => void;
}

export interface BatchFetcherControl<TResult> {
  results: Promise<TResult[]>;
  cancel: () => void;
}

const DEFAULT_CONFIG: Required<BatchFetcherConfig> = {
  maxPerBatch: 300,
  concurrency: 5,
};

/**
 * Creates a batch fetcher that processes items with controlled concurrency.
 * Uses p-limit to control how many fetches run in parallel.
 */
export const createBatchFetcher = <TItem, TResult>(
  batches: Record<string, TItem[]>,
  fetchBatch: (batchKey: string, items: TItem[]) => Promise<TResult[]>,
  callbacks: BatchFetcherCallbacks<TResult> = {},
  config: BatchFetcherConfig = {},
  signal?: AbortSignal,
): BatchFetcherControl<TResult> => {
  const { maxPerBatch, concurrency } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const limit = pLimit(concurrency);
  const allResults: TResult[] = [];
  let completedBatches = 0;
  let isCancelled = false;

  // Check if already aborted
  if (signal?.aborted) {
    return {
      results: Promise.reject(new Error('Aborted')),
      cancel: () => {},
    };
  }

  // Listen to abort signal
  signal?.addEventListener('abort', () => {
    isCancelled = true;
    limit.clearQueue();
  });

  const fetchTasks: Array<() => Promise<TResult[]>> = [];

  for (const [batchKey, items] of Object.entries(batches)) {
    for (const itemChunk of chunk(items, maxPerBatch)) {
      fetchTasks.push(() => fetchBatch(batchKey, itemChunk));
    }
  }

  const totalBatches = fetchTasks.length;

  const limitedPromises = fetchTasks.map((task) =>
    limit(async () => {
      if (isCancelled || signal?.aborted) {
        return [];
      }

      const results = await task();

      if (!isCancelled && !signal?.aborted) {
        allResults.push(...results);
        completedBatches++;
        callbacks.onProgress?.(completedBatches, totalBatches, [...allResults]);
      }

      return results;
    }),
  );

  const resultsPromise = Promise.allSettled(limitedPromises).then(
    (settledResults) => {
      if (isCancelled || signal?.aborted) {
        throw new Error('Aborted');
      }

      const failures = settledResults.filter((r) => r.status === 'rejected');
      if (failures.length > 0) {
        console.warn('Batch fetch failures:', failures);
      }

      callbacks.onComplete?.(allResults);
      return allResults;
    },
  );

  return {
    results: resultsPromise,
    cancel: () => {
      isCancelled = true;
      limit.clearQueue();
    },
  };
};
