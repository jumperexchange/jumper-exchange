import { useCallback, useMemo } from 'react';
import type { OrchestrationState, SourceState } from '../types';
import { usePriceLookup } from './usePriceLookup';

interface UseOrchestrationStateParams {
  balances: {
    isEmpty: boolean;
    isLoading: boolean;
    isFetching: boolean;
    isPlaceholderData: boolean;
    error: Error | null;
    updatedAt: number | null;
    refetch: () => void;
  };
  positions: {
    isEmpty: boolean;
    isLoading: boolean;
    isFetching: boolean;
    isPlaceholderData: boolean;
    error: Error | null;
    updatedAt: number | null;
    refetch: () => void;
  };
}

export const useOrchestrationState = ({
  balances,
  positions,
}: UseOrchestrationStateParams): OrchestrationState => {
  const pricesData = usePriceLookup();

  const balancesSource: SourceState = useMemo(
    () => ({
      isEmpty: balances.isEmpty,
      isLoading: balances.isLoading,
      isRefreshing: balances.isFetching && !balances.isEmpty,
      isStale: balances.isPlaceholderData,
      updatedAt: balances.updatedAt,
    }),
    [
      balances.isEmpty,
      balances.isLoading,
      balances.isFetching,
      balances.isPlaceholderData,
      balances.updatedAt,
    ],
  );

  const positionsSource: SourceState = useMemo(
    () => ({
      isEmpty: positions.isEmpty,
      isLoading: positions.isLoading,
      isRefreshing: positions.isFetching && !positions.isEmpty,
      isStale: positions.isPlaceholderData,
      updatedAt: positions.updatedAt,
    }),
    [
      positions.isEmpty,
      positions.isLoading,
      positions.isFetching,
      positions.isPlaceholderData,
      positions.updatedAt,
    ],
  );

  const pricesSource: SourceState = useMemo(
    () => ({
      isEmpty: !pricesData.hasFreshPrices && !pricesData.isLoading,
      isLoading: pricesData.isLoading,
      isRefreshing: false, // Prices don't have background refresh pattern
      isStale: !pricesData.hasFreshPrices,
      updatedAt: pricesData.updatedAt ?? null,
    }),
    [pricesData.hasFreshPrices, pricesData.isLoading, pricesData.updatedAt],
  );

  const isEmpty = balances.isEmpty && positions.isEmpty;

  const isInitialLoading =
    isEmpty && (balances.isLoading || positions.isLoading);

  const isRefreshing =
    !isEmpty &&
    (balancesSource.isRefreshing ||
      positionsSource.isRefreshing ||
      pricesData.isLoading);

  const isStale =
    balancesSource.isStale || positionsSource.isStale || pricesSource.isStale;

  const updatedAt = useMemo(() => {
    const timestamps = [
      balances.updatedAt,
      positions.updatedAt,
      pricesData.updatedAt,
    ].filter((t): t is number => t !== null && t !== undefined);

    return timestamps.length > 0 ? Math.min(...timestamps) : null;
  }, [balances.updatedAt, positions.updatedAt, pricesData.updatedAt]);

  const error = balances.error ?? positions.error ?? null;

  const refresh = useCallback(() => {
    balances.refetch();
    positions.refetch();
  }, [balances, positions]);

  return useMemo(
    () => ({
      isEmpty,
      isInitialLoading,
      isRefreshing,
      isStale,
      updatedAt,
      error,
      sources: {
        balances: balancesSource,
        positions: positionsSource,
        prices: pricesSource,
      },
      refresh,
    }),
    [
      isEmpty,
      isInitialLoading,
      isRefreshing,
      isStale,
      updatedAt,
      error,
      balancesSource,
      positionsSource,
      pricesSource,
      refresh,
    ],
  );
};
