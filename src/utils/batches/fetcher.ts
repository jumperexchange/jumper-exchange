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

export interface BatchFetcherControl {
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
): BatchFetcherControl => {
  const { maxPerBatch, concurrency } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const limit = pLimit(concurrency);
  const allResults: TResult[] = [];
  let completedBatches = 0;
  let isCancelled = false;

  // Split items into chunks and create all fetch tasks
  const fetchTasks: Array<() => Promise<TResult[]>> = [];

  for (const [batchKey, items] of Object.entries(batches)) {
    for (const itemChunk of chunk(items, maxPerBatch)) {
      fetchTasks.push(() => fetchBatch(batchKey, itemChunk));
    }
  }

  const totalBatches = fetchTasks.length;

  // Wrap each task with the limiter and progress tracking
  const limitedPromises = fetchTasks.map((task, index) =>
    limit(async () => {
      if (isCancelled) {
        return [];
      }

      const results = await task();

      if (!isCancelled) {
        allResults.push(...results);
        completedBatches++;
        callbacks.onProgress?.(completedBatches, totalBatches, [...allResults]);
      }

      return results;
    }),
  );

  // Execute all and handle completion
  Promise.allSettled(limitedPromises).then((settledResults) => {
    if (isCancelled) {
      return;
    }

    const failures = settledResults.filter((r) => r.status === 'rejected');
    if (failures.length > 0) {
      console.warn('Batch fetch failures:', failures);
    }

    callbacks.onComplete?.(allResults);
  });

  return {
    cancel: () => {
      isCancelled = true;
      limit.clearQueue();
    },
  };
};
