export enum TransactionErrorType {
  TransactionRejected = 'TransactionRejected',
  TransactionFailed = 'TransactionFailed',
  InsufficientBalance = 'InsufficientBalance',
  NetworkError = 'NetworkError',
  FetchCallDataFailed = 'FetchCallDataFailed',
  ChainSwitchFailed = 'ChainSwitchFailed',
  Unknown = 'Unknown',
}

export class TransactionError extends Error {
  constructor(
    message: string,
    public readonly type: TransactionErrorType,
  ) {
    super(message);
    this.name = 'TransactionError';
  }
}
