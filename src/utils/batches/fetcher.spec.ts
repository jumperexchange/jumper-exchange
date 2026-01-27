import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createBatchFetcher } from './fetcher';

describe('createBatchFetcher', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('basic batch processing', () => {
    it('should process all items and call onComplete', async () => {
      const batches = {
        chain1: ['a', 'b', 'c'],
      };
      const fetchBatch = vi.fn().mockResolvedValue(['result']);
      const onComplete = vi.fn();

      createBatchFetcher(batches, fetchBatch, { onComplete });

      await vi.runAllTimersAsync();

      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should call fetchBatch with correct batchKey and items', async () => {
      const batches = {
        chain1: ['a', 'b'],
        chain2: ['x', 'y'],
      };
      const fetchBatch = vi.fn().mockResolvedValue(['result']);

      createBatchFetcher(
        batches,
        fetchBatch,
        {},
        { maxFirstRound: 10, maxPerBatch: 10 },
      );

      await vi.runAllTimersAsync();

      expect(fetchBatch).toHaveBeenCalledWith('chain1', ['a', 'b']);
      expect(fetchBatch).toHaveBeenCalledWith('chain2', ['x', 'y']);
    });

    it('should not mutate the input batches', async () => {
      const batches = {
        chain1: ['a', 'b', 'c'],
      };
      const originalLength = batches.chain1.length;
      const fetchBatch = vi.fn().mockResolvedValue(['result']);

      createBatchFetcher(batches, fetchBatch);

      await vi.runAllTimersAsync();

      expect(batches.chain1.length).toBe(originalLength);
    });
  });

  describe('round-based fetching', () => {
    it('should respect maxFirstRound limit on first round', async () => {
      const batches = {
        chain1: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
      };
      const fetchBatch = vi.fn().mockResolvedValue(['result']);
      const onProgress = vi.fn();

      createBatchFetcher(
        batches,
        fetchBatch,
        { onProgress },
        { maxFirstRound: 3, maxPerBatch: 10, delayMs: 1000 },
      );

      await vi.advanceTimersByTimeAsync(0);

      expect(fetchBatch).toHaveBeenCalledTimes(1);
      expect(fetchBatch).toHaveBeenCalledWith('chain1', ['a', 'b', 'c']);
    });

    it('should respect maxPerBatch limit', async () => {
      const batches = {
        chain1: ['a', 'b', 'c', 'd', 'e'],
      };
      const fetchBatch = vi.fn().mockResolvedValue(['result']);

      createBatchFetcher(
        batches,
        fetchBatch,
        {},
        { maxFirstRound: 10, maxPerBatch: 2, delayMs: 1000 },
      );

      await vi.advanceTimersByTimeAsync(0);

      expect(fetchBatch).toHaveBeenCalledWith('chain1', ['a', 'b']);
    });

    it('should process remaining items in subsequent rounds', async () => {
      const batches = {
        chain1: ['a', 'b', 'c', 'd', 'e'],
      };
      const fetchBatch = vi.fn().mockResolvedValue(['result']);
      const onProgress = vi.fn();

      createBatchFetcher(
        batches,
        fetchBatch,
        { onProgress },
        { maxFirstRound: 2, maxPerBatch: 2, maxPerRound: 2, delayMs: 1000 },
      );

      await vi.advanceTimersByTimeAsync(0);
      expect(fetchBatch).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(1000);
      expect(fetchBatch).toHaveBeenCalledTimes(2);

      await vi.advanceTimersByTimeAsync(1000);
      expect(fetchBatch).toHaveBeenCalledTimes(3);
    });
  });

  describe('callbacks', () => {
    it('should call onProgress after each round with cumulative results', async () => {
      const batches = {
        chain1: ['a', 'b', 'c', 'd'],
      };
      const fetchBatch = vi
        .fn()
        .mockResolvedValueOnce(['r1', 'r2'])
        .mockResolvedValueOnce(['r3', 'r4']);
      const onProgress = vi.fn();

      createBatchFetcher(
        batches,
        fetchBatch,
        { onProgress },
        { maxFirstRound: 2, maxPerBatch: 2, maxPerRound: 2, delayMs: 1000 },
      );

      await vi.advanceTimersByTimeAsync(0);
      expect(onProgress).toHaveBeenCalledWith(1, ['r1', 'r2']);

      await vi.advanceTimersByTimeAsync(1000);
      expect(onProgress).toHaveBeenCalledWith(2, ['r1', 'r2', 'r3', 'r4']);
    });

    it('should call onComplete with all results when done', async () => {
      const batches = {
        chain1: ['a', 'b'],
      };
      const fetchBatch = vi.fn().mockResolvedValue(['result1', 'result2']);
      const onComplete = vi.fn();

      createBatchFetcher(
        batches,
        fetchBatch,
        { onComplete },
        { maxFirstRound: 10, maxPerBatch: 10 },
      );

      await vi.runAllTimersAsync();

      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith(['result1', 'result2']);
    });

    it('should call onComplete only once even with multiple in-flight rounds', async () => {
      const batches = {
        chain1: ['a', 'b', 'c', 'd', 'e', 'f'],
      };
      let resolveFirst: (value: string[]) => void;
      let resolveSecond: (value: string[]) => void;

      const fetchBatch = vi
        .fn()
        .mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              resolveFirst = resolve;
            }),
        )
        .mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              resolveSecond = resolve;
            }),
        );
      const onComplete = vi.fn();

      createBatchFetcher(
        batches,
        fetchBatch,
        { onComplete },
        { maxFirstRound: 3, maxPerBatch: 3, maxPerRound: 3, delayMs: 100 },
      );

      await vi.advanceTimersByTimeAsync(0);
      await vi.advanceTimersByTimeAsync(100);

      expect(fetchBatch).toHaveBeenCalledTimes(2);

      resolveSecond!(['r4', 'r5', 'r6']);
      await vi.advanceTimersByTimeAsync(0);

      expect(onComplete).not.toHaveBeenCalled();

      resolveFirst!(['r1', 'r2', 'r3']);
      await vi.advanceTimersByTimeAsync(0);

      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith(
        expect.arrayContaining(['r1', 'r2', 'r3', 'r4', 'r5', 'r6']),
      );
    });
  });

  describe('cancellation', () => {
    it('should stop processing when cancelled', async () => {
      const batches = {
        chain1: ['a', 'b', 'c', 'd', 'e', 'f'],
      };
      const fetchBatch = vi.fn().mockResolvedValue(['result']);
      const onComplete = vi.fn();

      const control = createBatchFetcher(
        batches,
        fetchBatch,
        { onComplete },
        { maxFirstRound: 2, maxPerBatch: 2, maxPerRound: 2, delayMs: 1000 },
      );

      await vi.advanceTimersByTimeAsync(0);
      expect(fetchBatch).toHaveBeenCalledTimes(1);

      control.cancel();

      await vi.advanceTimersByTimeAsync(5000);
      expect(fetchBatch).toHaveBeenCalledTimes(1);
      expect(onComplete).not.toHaveBeenCalled();
    });

    it('should not call callbacks after cancellation', async () => {
      const batches = {
        chain1: ['a', 'b'],
      };
      let resolveFetch: (value: string[]) => void;
      const fetchBatch = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveFetch = resolve;
          }),
      );
      const onProgress = vi.fn();
      const onComplete = vi.fn();

      const control = createBatchFetcher(
        batches,
        fetchBatch,
        { onProgress, onComplete },
        { maxFirstRound: 10, maxPerBatch: 10 },
      );

      await vi.advanceTimersByTimeAsync(0);

      control.cancel();

      resolveFetch!(['result']);
      await vi.advanceTimersByTimeAsync(0);

      expect(onProgress).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should continue processing when some fetches fail', async () => {
      const batches = {
        chain1: ['a', 'b'],
        chain2: ['x', 'y'],
      };
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      const fetchBatch = vi
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(['success']);
      const onProgress = vi.fn();
      const onComplete = vi.fn();

      createBatchFetcher(
        batches,
        fetchBatch,
        { onProgress, onComplete },
        { maxFirstRound: 10, maxPerBatch: 10 },
      );

      await vi.runAllTimersAsync();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Batch fetch failures:',
        expect.any(Array),
      );
      expect(onProgress).toHaveBeenCalledWith(1, ['success']);
      expect(onComplete).toHaveBeenCalledWith(['success']);

      consoleWarnSpy.mockRestore();
    });

    it('should handle all fetches failing in a round', async () => {
      const batches = {
        chain1: ['a'],
      };
      const consoleWarnSpy = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});
      const fetchBatch = vi.fn().mockRejectedValue(new Error('Failed'));
      const onComplete = vi.fn();

      createBatchFetcher(
        batches,
        fetchBatch,
        { onComplete },
        { maxFirstRound: 10, maxPerBatch: 10 },
      );

      await vi.runAllTimersAsync();

      expect(onComplete).toHaveBeenCalledWith([]);

      consoleWarnSpy.mockRestore();
    });
  });

  describe('empty batches', () => {
    it('should call onComplete immediately for empty batches', async () => {
      const batches = {};
      const fetchBatch = vi.fn();
      const onComplete = vi.fn();

      createBatchFetcher(batches, fetchBatch, { onComplete });

      await vi.advanceTimersByTimeAsync(0);

      expect(fetchBatch).not.toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalledWith([]);
    });

    it('should skip empty batch arrays', async () => {
      const batches = {
        chain1: [],
        chain2: ['a', 'b'],
      };
      const fetchBatch = vi.fn().mockResolvedValue(['result']);

      createBatchFetcher(
        batches,
        fetchBatch,
        {},
        { maxFirstRound: 10, maxPerBatch: 10 },
      );

      await vi.runAllTimersAsync();

      expect(fetchBatch).toHaveBeenCalledTimes(1);
      expect(fetchBatch).toHaveBeenCalledWith('chain2', ['a', 'b']);
    });
  });
});
