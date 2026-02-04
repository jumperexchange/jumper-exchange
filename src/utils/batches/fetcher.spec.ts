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

      createBatchFetcher(batches, fetchBatch, {}, { maxPerBatch: 10 });

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

  describe('chunking and concurrency', () => {
    it('should respect maxPerBatch limit', async () => {
      const batches = {
        chain1: ['a', 'b', 'c', 'd', 'e'],
      };
      const fetchBatch = vi.fn().mockResolvedValue(['result']);

      createBatchFetcher(batches, fetchBatch, {}, { maxPerBatch: 2 });

      await vi.runAllTimersAsync();

      expect(fetchBatch).toHaveBeenCalledTimes(3);
      expect(fetchBatch).toHaveBeenCalledWith('chain1', ['a', 'b']);
      expect(fetchBatch).toHaveBeenCalledWith('chain1', ['c', 'd']);
      expect(fetchBatch).toHaveBeenCalledWith('chain1', ['e']);
    });

    it('should respect concurrency limit', async () => {
      const batches = {
        chain1: ['a', 'b', 'c', 'd', 'e', 'f'],
      };
      let concurrentCalls = 0;
      let maxConcurrentCalls = 0;

      const fetchBatch = vi.fn().mockImplementation(async () => {
        concurrentCalls++;
        maxConcurrentCalls = Math.max(maxConcurrentCalls, concurrentCalls);
        await new Promise((resolve) => setTimeout(resolve, 100));
        concurrentCalls--;
        return ['result'];
      });

      createBatchFetcher(
        batches,
        fetchBatch,
        {},
        { maxPerBatch: 1, concurrency: 2 },
      );

      await vi.runAllTimersAsync();

      expect(maxConcurrentCalls).toBe(2);
      expect(fetchBatch).toHaveBeenCalledTimes(6);
    });
  });

  describe('callbacks', () => {
    it('should call onProgress after each batch with cumulative results', async () => {
      const batches = {
        chain1: ['a', 'b', 'c', 'd'],
      };
      // Add delays to ensure sequential processing with concurrency: 1
      const fetchBatch = vi
        .fn()
        .mockImplementationOnce(
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve(['r1', 'r2']), 10),
            ),
        )
        .mockImplementationOnce(
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve(['r3', 'r4']), 10),
            ),
        );
      const onProgress = vi.fn();

      // Use concurrency: 1 to ensure sequential execution for predictable order
      createBatchFetcher(
        batches,
        fetchBatch,
        { onProgress },
        { maxPerBatch: 2, concurrency: 1 },
      );

      await vi.runAllTimersAsync();

      expect(onProgress).toHaveBeenCalledTimes(2);
      // First call: 1 completed, 2 total
      expect(onProgress).toHaveBeenNthCalledWith(1, 1, 2, ['r1', 'r2']);
      // Second call: 2 completed, 2 total
      expect(onProgress).toHaveBeenNthCalledWith(2, 2, 2, [
        'r1',
        'r2',
        'r3',
        'r4',
      ]);
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
        { maxPerBatch: 10 },
      );

      await vi.runAllTimersAsync();

      expect(onComplete).toHaveBeenCalledTimes(1);
      expect(onComplete).toHaveBeenCalledWith(['result1', 'result2']);
    });

    it('should call onComplete only once', async () => {
      const batches = {
        chain1: ['a', 'b', 'c', 'd', 'e', 'f'],
      };
      const fetchBatch = vi.fn().mockResolvedValue(['result']);
      const onComplete = vi.fn();

      createBatchFetcher(
        batches,
        fetchBatch,
        { onComplete },
        { maxPerBatch: 2, concurrency: 3 },
      );

      await vi.runAllTimersAsync();

      expect(onComplete).toHaveBeenCalledTimes(1);
    });
  });

  describe('cancellation', () => {
    it('should stop processing when cancelled', async () => {
      const batches = {
        chain1: ['a', 'b', 'c', 'd', 'e', 'f'],
      };
      let resolveFirst: (value: string[]) => void;
      const fetchBatch = vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveFirst = resolve;
          }),
      );
      const onComplete = vi.fn();
      const onProgress = vi.fn();

      const control = createBatchFetcher(
        batches,
        fetchBatch,
        { onComplete, onProgress },
        { maxPerBatch: 1, concurrency: 1 },
      );

      // Let first fetch start
      await vi.advanceTimersByTimeAsync(0);
      expect(fetchBatch).toHaveBeenCalledTimes(1);

      // Cancel before first resolves
      control.cancel();

      // Resolve first fetch
      resolveFirst!(['result']);
      await vi.runAllTimersAsync();

      // Should not process more or call callbacks
      expect(onProgress).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();
    });

    it('should clear queued tasks on cancellation', async () => {
      const batches = {
        chain1: ['a', 'b', 'c', 'd', 'e', 'f'],
      };
      const fetchBatch = vi
        .fn()
        .mockImplementation(
          () =>
            new Promise((resolve) =>
              setTimeout(() => resolve(['result']), 100),
            ),
        );
      const onProgress = vi.fn();

      const control = createBatchFetcher(
        batches,
        fetchBatch,
        { onProgress },
        { maxPerBatch: 1, concurrency: 1 },
      );

      // Let first fetch start
      await vi.advanceTimersByTimeAsync(0);

      // Cancel immediately
      control.cancel();

      await vi.runAllTimersAsync();

      // Only the first one should have been called (was already in progress)
      expect(fetchBatch).toHaveBeenCalledTimes(1);
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
        { maxPerBatch: 10 },
      );

      await vi.runAllTimersAsync();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Batch fetch failures:',
        expect.any(Array),
      );
      expect(onComplete).toHaveBeenCalledWith(['success']);

      consoleWarnSpy.mockRestore();
    });

    it('should handle all fetches failing', async () => {
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
        { maxPerBatch: 10 },
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

      createBatchFetcher(batches, fetchBatch, {}, { maxPerBatch: 10 });

      await vi.runAllTimersAsync();

      expect(fetchBatch).toHaveBeenCalledTimes(1);
      expect(fetchBatch).toHaveBeenCalledWith('chain2', ['a', 'b']);
    });
  });
});
