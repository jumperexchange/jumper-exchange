import { RetryStoppedError } from './errors';

export const retryWithTimeout = async <T>(
  callback: () => Promise<T>,
  maxTimeoutMs: number,
  baseDelay: number = 2000,
): Promise<T> => {
  const now = Date.now();
  const startTime = now;
  const endTime = startTime + maxTimeoutMs;
  let attempt = 0;

  while (true) {
    try {
      return await callback();
    } catch (error) {
      if (
        error instanceof RetryStoppedError ||
        (error as Error).name === RetryStoppedError.errorName
      ) {
        console.warn('Retry stopped:', (error as Error).message);
        throw error;
      }

      const elapsedTime = Date.now() - startTime;
      const remainingTime = endTime - Date.now();

      console.error(
        `Attempt ${attempt + 1} failed after ${elapsedTime}ms:`,
        error,
      );

      if (remainingTime <= 0) {
        console.error(
          `Max timeout of ${maxTimeoutMs}ms reached, operation failed`,
        );
        throw error;
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt), 10000);

      if (delay <= 0) {
        console.error('No time remaining for retry');
        throw error;
      }

      console.warn(`Retrying in ${delay}ms... (${remainingTime}ms remaining)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      attempt++;
    }
  }
};
