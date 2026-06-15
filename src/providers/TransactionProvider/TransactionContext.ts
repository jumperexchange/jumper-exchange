import { createContext, useContext } from 'react';
import type { TransactionsDto } from '@/types/jumper-backend';

export interface TransactionContextValue {
  transactions: TransactionsDto[];
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
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
});

export const useTransactions = (): TransactionContextValue =>
  useContext(TransactionContext);
