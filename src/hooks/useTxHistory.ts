import { getTransactionHistory, TransactionAnalyticsResponse } from '@lifi/sdk';
import { useQuery } from '@tanstack/react-query';
import { FIVE_MINUTES_MS, THIRTY_MINUTES_MS } from 'src/const/time';

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
    staleTime: FIVE_MINUTES_MS, // Consider data fresh for 5 minutes
    gcTime: THIRTY_MINUTES_MS, // Keep data in cache for 30 minutes
  });

  return {
    data: data || null,
    total: Array.isArray(data?.transfers) ? data.transfers.length : 0,
    isLoading,
    isError,
    error,
  };
};
