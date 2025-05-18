import { getTransactionHistory, TransactionAnalyticsResponse } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';

export interface TxHistoryProps {
  data: TransactionAnalyticsResponse | null;
  total: number;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
}

export const useTxHistory = (
  walletAddress?: string,
  completedRouteId?: string,
): TxHistoryProps => {
  const toTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const fromTimestamp = toTimestamp - 30 * 24 * 60 * 60; // 30 days ago in seconds

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['transfers', walletAddress, completedRouteId],
    queryFn: () =>
      getTransactionHistory({
        wallet: walletAddress!,
        status: 'ALL',
        fromTimestamp,
        toTimestamp,
      }),
    enabled: !!walletAddress,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep data in cache for 30 minutes
  });

  return {
    data: data || null,
    total: Array.isArray(data?.transfers) ? data.transfers.length : 0,
    isLoading,
    isError,
    error,
  };
};
