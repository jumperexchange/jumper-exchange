import type { ExtendedToken } from '@/types/tokens';

export enum ProcessingTransactionCardStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export interface ProcessingTransactionCardProps {
  fromToken: ExtendedToken;
  toToken: ExtendedToken;
  status: ProcessingTransactionCardStatus;
  title: string;
  description: string;
  onClick?: () => void;
  /**
   * The target date to display the timer. If the target date is in the past, the timer will count up.
   * If not provided, the timer will not be displayed.
   */
  targetTime?: number;
}
