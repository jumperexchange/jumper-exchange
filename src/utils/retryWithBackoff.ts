export const retryWithBackoff = async <T>(
  callback: () => Promise<T>,
  maxRetries: number = 5,
  baseDelay: number = 2000,
): Promise<T> => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await callback();
    } catch (error) {
      console.error(`Attempt ${attempt + 1}/${maxRetries + 1} failed:`, error);

      if (attempt === maxRetries) {
        console.error('Max retries reached, operation failed');
        throw error;
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt), 10000);
      console.warn(`Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error(
    'Unexpected: retry loop completed without returning or throwing',
  );
};
