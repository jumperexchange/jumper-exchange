export class RetryStoppedError extends Error {
  static errorName = 'RetryStoppedError';
  constructor(message: string) {
    super(message);
    this.name = RetryStoppedError.errorName;
  }
}
