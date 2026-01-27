export interface BatchFetcherConfig {
  /** Maximum items per fetch round across all batches */
  maxPerRound?: number;
  /** Maximum items per batch per round */
  maxPerBatch?: number;
  /** Delay between rounds in ms */
  delayMs?: number;
  /** Maximum items on first round (for faster initial load) */
  maxFirstRound?: number;
}

export interface BatchFetcherCallbacks<TItem, TResult> {
  /** Called after each round with cumulative results */
  onProgress?: (round: number, results: TResult[]) => void;
  /** Called when all batches are complete */
  onComplete?: (results: TResult[]) => void;
}

export interface BatchFetcherControl {
  cancel: () => void;
}

const DEFAULT_CONFIG: Required<BatchFetcherConfig> = {
  maxPerRound: 10000,
  maxPerBatch: 300,
  delayMs: 3000,
  maxFirstRound: 7,
};

/**
 * Creates a batch fetcher that processes items in rounds with delays.
 * Concurrent-safe: tracks in-flight rounds and only fires onComplete when all resolve.
 */
export const createBatchFetcher = <TItem, TResult>(
  batches: Record<string, TItem[]>,
  fetchBatch: (batchKey: string, items: TItem[]) => Promise<TResult[]>,
  callbacks: BatchFetcherCallbacks<TItem, TResult> = {},
  config: BatchFetcherConfig = {},
): BatchFetcherControl => {
  const { maxPerRound, maxPerBatch, delayMs, maxFirstRound } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  let nextRound = 1;
  const allResults: TResult[] = [];

  let inFlightRounds = 0;
  let allBatchesExhausted = false;
  let isCompleted = false;
  let isCancelled = false;

  const remainingBatches: Record<string, TItem[]> = Object.keys(batches).reduce(
    (acc, key) => {
      acc[key] = [...batches[key]];
      return acc;
    },
    {} as Record<string, TItem[]>,
  );

  const tryComplete = () => {
    if (isCompleted || isCancelled) {
      return;
    }
    if (inFlightRounds === 0 && allBatchesExhausted) {
      isCompleted = true;
      clearInterval(intervalId);
      callbacks.onComplete?.(allResults);
    }
  };

  const fetchRound = async () => {
    if (isCompleted || isCancelled || allBatchesExhausted) {
      return;
    }

    const thisRound = nextRound++;
    let itemsFetchedThisRound = 0;
    const fetchPromises: Promise<TResult[]>[] = [];

    for (const batchKey of Object.keys(remainingBatches)) {
      if (itemsFetchedThisRound >= maxPerRound) {
        break;
      }

      const items = remainingBatches[batchKey];
      if (!items || items.length === 0) {
        continue;
      }

      const maxThisRound =
        thisRound === 1 ? maxFirstRound : maxPerRound - itemsFetchedThisRound;
      const itemsToFetch = Math.min(maxPerBatch, items.length, maxThisRound);

      if (itemsToFetch <= 0) {
        continue;
      }

      const batch = items.splice(0, itemsToFetch);
      itemsFetchedThisRound += itemsToFetch;
      fetchPromises.push(fetchBatch(batchKey, batch));
    }

    const batchesEmpty = Object.values(remainingBatches).every(
      (items) => items.length === 0,
    );
    if (batchesEmpty) {
      allBatchesExhausted = true;
      clearInterval(intervalId);
    }

    if (fetchPromises.length === 0) {
      tryComplete();
      return;
    }

    inFlightRounds++;

    const settledResults = await Promise.allSettled(fetchPromises);

    inFlightRounds--;

    if (isCancelled) {
      return;
    }

    const successfulResults = settledResults
      .filter(
        (r): r is PromiseFulfilledResult<TResult[]> => r.status === 'fulfilled',
      )
      .map((r) => r.value);
    allResults.push(...successfulResults.flat());

    const failures = settledResults.filter((r) => r.status === 'rejected');
    if (failures.length > 0) {
      console.warn('Batch fetch failures:', failures);
    }

    callbacks.onProgress?.(thisRound, allResults);

    tryComplete();
  };

  const intervalId = setInterval(fetchRound, delayMs);
  fetchRound();

  return {
    cancel: () => {
      isCancelled = true;
      clearInterval(intervalId);
    },
  };
};
