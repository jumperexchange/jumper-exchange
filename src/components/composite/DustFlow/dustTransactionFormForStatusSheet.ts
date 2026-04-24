import type { TransactionErrorType } from '@/hooks/transactions/types';

/**
 * Subset of {@link useTransactionForm} API required by the dust conversion status sheet
 * (interface segregation).
 */
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
