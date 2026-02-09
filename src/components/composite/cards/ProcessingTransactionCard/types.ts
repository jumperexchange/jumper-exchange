import type { ExtendedToken } from '@/types/tokens';

export type ProcessingTransactionCardStatus = 'pending' | 'success' | 'failed';

export interface ProcessingTransactionCardProps {
  fromToken: ExtendedToken;
  toToken: ExtendedToken;
  status: ProcessingTransactionCardStatus;
  title: string;
  description: string;
  /**
   * The target date to display the timer. If the target date is in the past, the timer will count up.
   * If not provided, the timer will not be displayed.
   */
  targetTime?: number;
  onClick?: () => void;
}
