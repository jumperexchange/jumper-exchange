import { useQueries } from '@tanstack/react-query';
import { min } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ONE_HOUR_MS } from 'src/const/time';
import type { Hex } from 'viem';
import type { PortfolioPositionsQuery } from '@/app/lib/getPositionsForAddress';
import { getPositionsForAddress } from '@/app/lib/getPositionsForAddress';
import type { DefiPosition } from '@/utils/positions/type-guards';
import { useAccount } from '@lifi/wallet-management';
import { usePortfolioCacheStore } from '@/stores/portfolio/PortfolioCacheStore';

export interface UsePositionsDataProps {
  filter?: Omit<PortfolioPositionsQuery, 'evm'>;
}

export interface UsePositionsDataResult {
  positions: DefiPosition[];
  positionsByAddress: Record<string, DefiPosition[]>;
  isLoading: boolean;
  isFetching: boolean;
  isPlaceholderData: boolean;
  isSuccess: boolean;
  error: Error | null;
  updatedAt: number | null;
  refetch: () => void;
}

type PositionsFilter = Omit<PortfolioPositionsQuery, 'evm'>;

const hasFilteringKeys = (filter?: PositionsFilter): boolean => {
  if (!filter) {
    return false;
  }

  const nonFilteringKeys: Array<keyof PositionsFilter> = ['sortBy', 'order'];

  return Object.keys(filter).some(
    (key) => !nonFilteringKeys.includes(key as keyof PositionsFilter),
  );
};

interface QueryData {
  data: DefiPosition[];
  meta: { updatedAt: string };
  address: Hex;
}

export const usePositionsData = ({
  filter,
}: UsePositionsDataProps): UsePositionsDataResult => {
  const { accounts } = useAccount();
  const addresses = accounts
    .filter((acc) => acc.isConnected && acc.chainType === 'EVM' && acc.address)
    .map((acc) => acc.address as Hex);

  const getPositions = usePortfolioCacheStore((s) => s.getPositions);
  const setPositionsCache = usePortfolioCacheStore((s) => s.setPositions);
  const positionPatchVersion = usePortfolioCacheStore(
    (s) => s.positionPatchVersion,
  );

  const [lastPatchVersion, setLastPatchVersion] =
    useState(positionPatchVersion);
  const wasCachePatched = positionPatchVersion !== lastPatchVersion;

  const shouldSetCacheRef = useRef(false);
  const shouldUseCache = !hasFilteringKeys(filter);

  const queries = useQueries({
    queries: addresses.map((address) => ({
      queryKey: ['portfolio-positions', address, filter],
      queryFn: async (): Promise<QueryData> => {
        shouldSetCacheRef.current = shouldUseCache;

        const result = await getPositionsForAddress({
          evm: address,
          ...filter,
        });
        return { ...result.data, address };
      },
      enabled: !!address,
      refetchInterval: ONE_HOUR_MS,
      placeholderData: shouldUseCache
        ? (): QueryData | undefined => {
            const cached = getPositions(address);
            if (cached.length > 0) {
              return {
                data: cached,
                meta: { updatedAt: '' },
                address,
              };
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
      if (query.isSuccess && query.data && !query.isPlaceholderData) {
        const { address, data: positions } = query.data;
        setPositionsCache(address, positions);
      }
    });
  }, [queries, setPositionsCache, shouldUseCache]);

  useEffect(() => {
    if (wasCachePatched) {
      setLastPatchVersion(positionPatchVersion);
    }
  }, [positionPatchVersion, wasCachePatched]);

  const isLoading = queries.some((query) => query.isLoading);
  const isFetching = queries.some((query) => query.isFetching);
  const isPlaceholderData = queries.some((query) => query.isPlaceholderData);
  const isSuccess = queries.every((query) => query.isSuccess);
  const error = (queries.find((query) => query.error)?.error as Error) ?? null;

  const successfulQueries = useMemo(
    () => queries.filter((query) => query.isSuccess && query.data),
    [queries],
  );

  const positions = useMemo((): DefiPosition[] => {
    if (wasCachePatched && shouldUseCache) {
      return addresses.flatMap((address) => getPositions(address));
    }
    return successfulQueries.flatMap((query) => query.data?.data ?? []);
  }, [
    successfulQueries,
    wasCachePatched,
    shouldUseCache,
    addresses,
    getPositions,
  ]);

  const positionsByAddress = useMemo((): Record<string, DefiPosition[]> => {
    if (wasCachePatched && shouldUseCache) {
      return addresses.reduce(
        (acc, address) => {
          acc[address] = getPositions(address);
          return acc;
        },
        {} as Record<string, DefiPosition[]>,
      );
    }

    return addresses.reduce(
      (acc, address) => {
        const query = successfulQueries.find(
          (q) => q.data?.address === address,
        );
        acc[address] = query?.data?.data ?? [];
        return acc;
      },
      {} as Record<string, DefiPosition[]>,
    );
  }, [
    addresses,
    successfulQueries,
    wasCachePatched,
    shouldUseCache,
    getPositions,
  ]);

  const updatedAt = useMemo((): number | null => {
    if (successfulQueries.length === 0) {
      return null;
    }

    const dates = successfulQueries.map((query) => {
      const metaUpdatedAt = query.data?.meta?.updatedAt;
      return metaUpdatedAt
        ? new Date(metaUpdatedAt)
        : new Date(query.dataUpdatedAt);
    });

    return dates.length > 0 ? min(dates).getTime() : null;
  }, [successfulQueries]);

  const refetch = useCallback(() => {
    queries.forEach((query) => query.refetch());
  }, [queries]);

  return {
    positions,
    positionsByAddress,
    isLoading,
    isFetching,
    isPlaceholderData,
    isSuccess,
    error,
    updatedAt,
    refetch,
  };
};
