export class RetryStoppedError extends Error {
  static errorName = 'RetryStoppedError';
  constructor(message: string) {
    super(message);
    this.name = RetryStoppedError.errorName;
  }
}

export const isRateLimitError = (error: Error) =>
  (error as unknown as { status?: number }).status === 429;
