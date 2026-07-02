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
    refetch: refetchAllPages,
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

  const pageCount = data?.pages.length ?? 0;
  const currentPage = data?.pages[currentPageIndex];

  // Once an error is present, don't offer to load further pages until it
  // clears (retry/refetch) — this avoids hammering an already-erroring or
  // rate-limited endpoint. Pages already cached for earlier indices remain
  // reachable via goToPreviousPage regardless of the error.
  const hasNextPage =
    !error && (currentPageIndex < pageCount - 1 || !!infiniteHasNextPage);
  const hasPreviousPage = currentPageIndex > 0;

  const goToNextPage = useCallback(async () => {
    if (currentPageIndex < pageCount - 1) {
      setCurrentPageIndex((i) => i + 1);
    } else if (infiniteHasNextPage) {
      const result = await fetchNextPage();
      if (result.status === 'success') {
        setCurrentPageIndex((i) => i + 1);
      }
    }
  }, [currentPageIndex, pageCount, infiniteHasNextPage, fetchNextPage]);

  const goToPreviousPage = useCallback(() => {
    setCurrentPageIndex((i) => Math.max(0, i - 1));
  }, []);

  // refetch() re-fetches every cached page sequentially, which would
  // multiply requests against an already-erroring/rate-limited endpoint.
  // Only the initial load (no pages yet) needs it; once pages exist,
  // fetchNextPage() retries with a single request for the next page.
  const retry = useCallback(() => {
    if (pageCount > 0) {
      fetchNextPage();
    } else {
      refetchAllPages();
    }
  }, [pageCount, fetchNextPage, refetchAllPages]);

  const triggerForceRefresh = useCallback(() => {
    setCurrentPageIndex(0);
    triggerForceRefreshBase();
  }, [triggerForceRefreshBase]);

  const value = useMemo(
    () => ({
      // react-query keeps the last successful data on a failed fetch, so
      // currentPage can still hold stale (previously valid) transactions
      // while `error` is set. Don't render them — an active error means
      // the list is out of date until it's retried successfully.
      transactions: error ? [] : (currentPage?.transactions.data ?? []),
      hasNextPage,
      hasPreviousPage,
      goToNextPage,
      goToPreviousPage,
      isLoading: isLoading || isFetchingNextPage,
      error: error as Error | null,
      refetch: retry,
      triggerForceRefresh,
      rateLimit,
    }),
    [
      currentPage,
      hasNextPage,
      hasPreviousPage,
      goToNextPage,
      goToPreviousPage,
      isLoading,
      isFetchingNextPage,
      error,
      retry,
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
