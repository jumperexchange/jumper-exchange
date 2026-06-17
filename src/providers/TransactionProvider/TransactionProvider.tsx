'use client';

import {
  useCallback,
  useMemo,
  useState,
  useEffect,
  type PropsWithChildren,
} from 'react';
import { TransactionContext } from './TransactionContext';
import { useTransactionsData } from './hooks/useTransactionsData';
import type { TransactionsDto } from '@/types/jumper-backend';

interface TransactionProviderProps extends PropsWithChildren {
  walletAddress?: string | null;
  minDate?: string | null;
  maxDate?: string | null;
  chainIds?: number[];
  types?: TransactionsDto['action'][];
  assets?: string[];
  enabled?: boolean;
}

export const TransactionProvider = ({
  children,
  walletAddress,
  minDate,
  maxDate,
  chainIds,
  types,
  assets,
  enabled,
}: TransactionProviderProps) => {
  const [page, setPageState] = useState(0);
  const [cursors, setCursors] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    setPageState(0);
    setCursors(new Map());
  }, [walletAddress, minDate, maxDate, chainIds, types, assets]);

  const cursor = page === 0 ? undefined : (cursors.get(page) ?? null);

  const { data, isLoading, error, refetch, triggerForceRefresh, rateLimit } =
    useTransactionsData({
      walletAddress,
      minDate,
      maxDate,
      cursor,
      chainIds,
      types,
      assets,
      enabled,
    });

  useEffect(() => {
    if (data?.meta?.next) {
      setCursors((prev) => {
        if (prev.get(page + 1) === data.meta.next) {
          return prev;
        }
        const next = new Map(prev);
        next.set(page + 1, data.meta.next!);
        return next;
      });
    }
  }, [data?.meta?.next, page]);

  const hasNextPage = !!data?.meta?.next;
  const hasPreviousPage = page > 0;

  const goToNextPage = useCallback(() => {
    if (!data?.meta?.next) {
      return;
    }
    setPageState((currentPage) => currentPage + 1);
  }, [data?.meta?.next]);

  const goToPreviousPage = useCallback(() => {
    setPageState((currentPage) => {
      if (currentPage <= 0) {
        return currentPage;
      }
      return currentPage - 1;
    });
  }, []);

  const value = useMemo(
    () => ({
      transactions: data?.data ?? [],
      hasNextPage,
      hasPreviousPage,
      goToNextPage,
      goToPreviousPage,
      isLoading,
      error: error as Error | null,
      refetch,
      triggerForceRefresh,
      rateLimit,
    }),
    [
      data?.data,
      hasNextPage,
      hasPreviousPage,
      goToNextPage,
      goToPreviousPage,
      isLoading,
      error,
      refetch,
      triggerForceRefresh,
      rateLimit,
    ],
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
