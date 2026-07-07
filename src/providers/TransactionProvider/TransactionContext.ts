import { createContext, useContext } from 'react';
import type { TransactionsDto } from '@/types/jumper-backend';
import type { RateLimitInfo } from './hooks/useTransactionsData';

export interface TransactionContextValue {
  transactions: TransactionsDto[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  triggerForceRefresh: () => void;
  rateLimit: RateLimitInfo | null;
}

export const TransactionContext = createContext<TransactionContextValue>({
  transactions: [],
  hasNextPage: false,
  hasPreviousPage: false,
  goToNextPage: () => {},
  goToPreviousPage: () => {},
  isLoading: false,
  error: null,
  refetch: () => {},
  triggerForceRefresh: () => {},
  rateLimit: null,
});

export const useTransactions = (): TransactionContextValue =>
  useContext(TransactionContext);
