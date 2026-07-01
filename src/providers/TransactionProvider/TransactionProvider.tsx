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
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    setCurrentPageIndex(0);
  }, [walletAddress, minDate, maxDate, chainIds, types, assets]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage: infiniteHasNextPage,
    fetchNextPage,
    error,
    refetch,
    triggerForceRefresh: triggerForceRefreshBase,
    rateLimit,
  } = useTransactionsData({
    walletAddress,
    minDate,
    maxDate,
    chainIds,
    types,
    assets,
    enabled,
  });

  const hasNextPage =
    currentPageIndex < (data?.pages.length ?? 0) - 1 || !!infiniteHasNextPage;
  const hasPreviousPage = currentPageIndex > 0;

  const goToNextPage = useCallback(() => {
    if (currentPageIndex < (data?.pages.length ?? 0) - 1) {
      setCurrentPageIndex((i) => i + 1);
    } else if (infiniteHasNextPage) {
      fetchNextPage();
      setCurrentPageIndex((i) => i + 1);
    }
  }, [
    currentPageIndex,
    data?.pages.length,
    infiniteHasNextPage,
    fetchNextPage,
  ]);

  const goToPreviousPage = useCallback(() => {
    setCurrentPageIndex((i) => Math.max(0, i - 1));
  }, []);

  const triggerForceRefresh = useCallback(() => {
    setCurrentPageIndex(0);
    triggerForceRefreshBase();
  }, [triggerForceRefreshBase]);

  const value = useMemo(
    () => ({
      transactions: data?.pages[currentPageIndex]?.transactions.data ?? [],
      hasNextPage,
      hasPreviousPage,
      goToNextPage,
      goToPreviousPage,
      isLoading: isLoading || isFetchingNextPage,
      error: error as Error | null,
      refetch,
      triggerForceRefresh,
      rateLimit,
    }),
    [
      data?.pages,
      currentPageIndex,
      hasNextPage,
      hasPreviousPage,
      goToNextPage,
      goToPreviousPage,
      isLoading,
      isFetchingNextPage,
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
