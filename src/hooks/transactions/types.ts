export enum TransactionErrorType {
  TransactionRejected = 'TransactionRejected',
  TransactionFailed = 'TransactionFailed',
  TransactionReverted = 'TransactionReverted',
  TransactionCanceled = 'TransactionCanceled',
  InsufficientBalance = 'InsufficientBalance',
  NetworkError = 'NetworkError',
  FetchCallDataFailed = 'FetchCallDataFailed',
  ChainSwitchFailed = 'ChainSwitchFailed',
  WalletDoesNotSupportBatchTransactions = 'WalletDoesNotSupportBatchTransactions',
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
