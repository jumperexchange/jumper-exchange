import { format } from 'date-fns';
import { capitalizeString } from '@/utils/capitalizeString';
import type {
  TransactionOperationType,
  TransactionSummaryColumnId,
} from './types';
import { TRANSACTION_SUMMARY_ROW_CONFIG } from './constants';

const toUtcDisplayDate = (time: Date): Date =>
  new Date(time.getTime() + time.getTimezoneOffset() * 60_000);

export const formatTransactionAction = (
  action: TransactionOperationType,
): string => capitalizeString(action);

export const formatTransactionDateTitle = (time: Date | string): string =>
  format(toUtcDisplayDate(new Date(time)), 'MMM d, yyyy');

export const formatTransactionDateHint = (time: Date | string): string =>
  `${format(toUtcDisplayDate(new Date(time)), 'HH:mm')} UTC`;

export const getTransactionSummaryColumnTestId = (
  columnId: TransactionSummaryColumnId,
  appendTestId = TRANSACTION_SUMMARY_ROW_CONFIG.testId,
): string | undefined => {
  return `${appendTestId}-${columnId}`;
};
