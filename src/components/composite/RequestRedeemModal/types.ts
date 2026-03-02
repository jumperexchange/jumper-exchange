export enum RequestRedeemErrorType {
  // Transaction-specific errors
  TransactionRejected = 'transactionRejected',
  TransactionFailed = 'transactionFailed',

  // Balance/amount errors
  InsufficientBalance = 'insufficientBalance',

  // Network/API errors
  NetworkError = 'networkError',
  FetchCallDataFailed = 'fetchCallDataFailed',

  // Chain errors
  ChainSwitchFailed = 'chainSwitchFailed',

  // Generic
  Unknown = 'unknown',
}

export class RequestRedeemError extends Error {
  constructor(
    message: string,
    public type: RequestRedeemErrorType,
  ) {
    super(message);
    this.name = 'RequestRedeemError';
  }
}

export interface RequestRedeemFormState {
  amount: string;
  currentStep:
    | 'idle'
    | 'confirmation'
    | 'fetching'
    | 'approving'
    | 'requesting'
    | 'success';
  isSubmitting: boolean;
  isError: boolean;
  errorType: RequestRedeemErrorType;
  showConfirmationSheet: boolean;
  showSuccessSheet: boolean;
  currentActionIndex: number;
}

export enum RequestRedeemModalView {
  REQUEST_WITHDRAW = 'requestWithdraw',
  CLAIM_REDEEM = 'claimRedeem',
}
