import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useAccount } from '@lifi/wallet-management';
import type { Hex } from 'viem';
import { compact, map, max } from 'lodash';
import type { DefiPosition } from '@/types/jumper-backend';
import { ONE_HOUR_MS } from 'src/const/time';
import {
  fetchPositionsForAddress,
  type FetchPositionsResult,
} from '../datasources/positions.datasource';
import type { PortfolioPositionsQuery } from '@/app/lib/getPositionsForAddress';
import { usePortfolioCacheStore } from '@/stores/portfolio/PortfolioCacheStore';

export interface UsePositionsDataParams {
  filter?: Omit<PortfolioPositionsQuery, 'evm'>;
}

export interface UsePositionsDataResult {
  positions: DefiPosition[];
  positionsByAddress: Record<string, DefiPosition[]>;
  isLoading: boolean;
  error: Error | null;
  updatedAt: number | null;
  refetch: () => void;
}

const hasFilteringKeys = (
  filter?: Omit<PortfolioPositionsQuery, 'evm'>,
): boolean => {
  if (!filter) {
    return false;
  }
  const nonFilteringKeys: Array<keyof Omit<PortfolioPositionsQuery, 'evm'>> = [
    'sortBy',
    'order',
  ];
  return Object.keys(filter).some(
    (key) => !nonFilteringKeys.includes(key as keyof typeof filter),
  );
};

export const usePositionsData = ({
  filter,
}: UsePositionsDataParams = {}): UsePositionsDataResult => {
  const { accounts } = useAccount();
  const getPositions = usePortfolioCacheStore((s) => s.getPositions);
  const setPositionsCache = usePortfolioCacheStore((s) => s.setPositions);
  const positionPatchVersion = usePortfolioCacheStore(
    (s) => s.positionPatchVersion,
  );

  const [lastPatchVersion, setLastPatchVersion] =
    useState(positionPatchVersion);
  const wasCachePatched = positionPatchVersion !== lastPatchVersion;

  const shouldSetCacheRef = useRef<boolean>(false);

  const evmAddresses = useMemo(
    () =>
      accounts
        .filter(
          (acc) => acc.isConnected && acc.chainType === 'EVM' && acc.address,
        )
        .map((acc) => acc.address as Hex),
    [accounts],
  );

  const shouldUseCache = !hasFilteringKeys(filter);

  const queries = useQueries({
    queries: evmAddresses.map((address) => ({
      queryKey: ['portfolio-positions', address, filter],
      queryFn: () => {
        shouldSetCacheRef.current = shouldUseCache;
        return fetchPositionsForAddress({ address, filter });
      },
      enabled: !!address,
      refetchInterval: ONE_HOUR_MS,
      placeholderData: shouldUseCache
        ? () => {
            const cached = getPositions(address);
            if (cached.length > 0) {
              return { positions: cached, meta: { updatedAt: '' }, address };
            }
            return undefined;
          }
        : undefined,
    })),
  });

  useEffect(() => {
    if (!shouldUseCache || !shouldSetCacheRef.current) {
      return;
    }

    shouldSetCacheRef.current = false;

    queries.forEach((query) => {
      if (query.isSuccess && query.data) {
        const { address, positions } = query.data;
        setPositionsCache(address, positions);
      }
    });
  }, [queries, setPositionsCache, shouldUseCache]);

  const isLoading = queries.some((q) => q.isLoading);
  const error = queries.find((q) => q.error)?.error as Error | null;

  const fetchResults = queries
    .filter((q) => q.data)
    .map((q) => q.data as FetchPositionsResult);

  // Update last patch version when it changes
  useEffect(() => {
    if (wasCachePatched) {
      setLastPatchVersion(positionPatchVersion);
    }
  }, [positionPatchVersion, wasCachePatched]);

  // Use cached positions when cache was patched, otherwise use query results
  const positions = useMemo(() => {
    if (wasCachePatched && shouldUseCache) {
      // Read fresh positions from cache after a patch
      return evmAddresses.flatMap((address) => getPositions(address));
    }
    return fetchResults.flatMap((r) => r.positions);
  }, [
    fetchResults,
    wasCachePatched,
    shouldUseCache,
    evmAddresses,
    getPositions,
  ]);

  const positionsByAddress = useMemo(() => {
    if (wasCachePatched && shouldUseCache) {
      // Read fresh positions from cache after a patch
      return evmAddresses.reduce(
        (acc, address) => {
          acc[address] = getPositions(address);
          return acc;
        },
        {} as Record<string, DefiPosition[]>,
      );
    }
    return fetchResults.reduce(
      (acc, result) => {
        acc[result.address] = result.positions;
        return acc;
      },
      {} as Record<string, DefiPosition[]>,
    );
  }, [
    fetchResults,
    wasCachePatched,
    shouldUseCache,
    evmAddresses,
    getPositions,
  ]);

  const updatedAt = useMemo(() => {
    const metaTimestamps = compact(
      map(fetchResults, (r) => {
        const timestamp = new Date(r.meta.updatedAt).getTime();
        return !isNaN(timestamp) ? timestamp : null;
      }),
    );

    if (metaTimestamps.length > 0) {
      return max(metaTimestamps) ?? null;
    }

    const queryTimestamps = compact(map(queries, (q) => q.dataUpdatedAt));

    return queryTimestamps.length > 0 ? (max(queryTimestamps) ?? null) : null;
  }, [fetchResults, queries]);

  const refetch = useCallback(() => {
    queries.forEach((q) => q.refetch());
  }, [queries]);

  return {
    positions,
    positionsByAddress,
    isLoading,
    error,
    updatedAt,
    refetch,
  };
};
