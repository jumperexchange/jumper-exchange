import type {
  PortfolioBalance,
  WalletToken,
  ExtendedToken,
} from '@/types/tokens';

export interface DustPartialQuoteState {
  failedBalances: PortfolioBalance<WalletToken>[];
  proceedableBalances: PortfolioBalance<WalletToken>[];
}

import type { TransactionErrorType } from '@/hooks/transactions/types';

export interface DustSummaryValue {
  selectedBalances: PortfolioBalance<WalletToken>[];
  nativeToken: ExtendedToken;
  amount: string;
  amountUSD: number;
  address: string;
}

export interface DustFieldDeriveResult {
  threshold: number | undefined;
  chainId: number | undefined;
  isValid: boolean;
}

export interface TransactionFormForDustStatusSheet {
  showConfirmationSheet: boolean;
  showErrorBottomSheet: boolean;
  showSuccessSheet: boolean;
  errorType: TransactionErrorType;
  handleCloseSheet: () => void;
  handleCloseSuccess: () => void;
  handleCloseError: () => void;
  handleRetry: () => void | Promise<void>;
  handleViewTransaction: () => void;
  handleConfirm: () => void | Promise<void>;
}
