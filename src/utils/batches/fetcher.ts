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

const DEFAULT_CONFIG: Required<BatchFetcherConfig> = {
  maxPerRound: 10000,
  maxPerBatch: 300,
  delayMs: 3000,
  maxFirstRound: 7,
};

/**
 * Creates a batch fetcher that processes items in rounds with delays.
 * Returns an interval ID that can be used to cancel the process.
 */
export const createBatchFetcher = <TItem, TResult>(
  batches: Record<string, TItem[]>,
  fetchBatch: (batchKey: string, items: TItem[]) => Promise<TResult[]>,
  callbacks: BatchFetcherCallbacks<TItem, TResult> = {},
  config: BatchFetcherConfig = {},
): NodeJS.Timeout => {
  const { maxPerRound, maxPerBatch, delayMs, maxFirstRound } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  let round = 1;
  const allResults: TResult[] = [];

  // Clone batches to avoid mutating input
  const remainingBatches: Record<string, TItem[]> = Object.keys(batches).reduce(
    (acc, key) => {
      acc[key] = [...batches[key]];
      return acc;
    },
    {} as Record<string, TItem[]>,
  );

  const fetchRound = async () => {
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
        round === 1 ? maxFirstRound : maxPerRound - itemsFetchedThisRound;

      const itemsToFetch = Math.min(maxPerBatch, items.length, maxThisRound);

      if (itemsToFetch <= 0) {
        continue;
      }

      const batch = items.splice(0, itemsToFetch);
      itemsFetchedThisRound += itemsToFetch;

      fetchPromises.push(fetchBatch(batchKey, batch));
    }

    if (fetchPromises.length === 0) {
      clearInterval(intervalId);
      callbacks.onComplete?.(allResults);
      return;
    }

    const roundResults = await Promise.all(fetchPromises);
    allResults.push(...roundResults.flat());

    callbacks.onProgress?.(round, allResults);

    round += 1;

    const allDone = Object.values(remainingBatches).every(
      (items) => items.length === 0,
    );

    if (allDone) {
      clearInterval(intervalId);
      callbacks.onComplete?.(allResults);
    }
  };

  const intervalId = setInterval(fetchRound, delayMs);

  // First fetch immediately
  fetchRound();

  return intervalId;
};
