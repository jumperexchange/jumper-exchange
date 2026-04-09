import { useQueries } from '@tanstack/react-query';
import { min } from 'date-fns';
import groupBy from 'lodash/groupBy';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ONE_HOUR_MS } from 'src/const/time';
import type { Hex } from 'viem';
import type {
  AddressQueryParams,
  PortfolioPositionsQuery,
} from '@/app/lib/getPositionsForAddress';
import { getPositionsForAddresses } from '@/app/lib/getPositionsForAddress';
import type { DefiPosition } from '@/utils/positions/type-guards';
import type { Account } from '@lifi/widget-provider';
import { useAccount } from '@lifi/wallet-management';
import { usePortfolioCacheStore } from '@/stores/portfolio/PortfolioCacheStore';
import { usePathnameWithoutLocale } from '@/hooks/routing/usePathnameWithoutLocale';
import { isCurrentPageUsingPositionData } from '../utils';
import { useAccountGroupsByChainType } from '@/hooks/accounts/useAccountGroupsByChainType';

type PositionsFilter = Omit<
  NonNullable<PortfolioPositionsQuery>,
  keyof AddressQueryParams
>;

export interface UsePositionsDataProps {
  filter?: PositionsFilter;
}

export interface UsePositionsDataResult {
  positions: DefiPosition[];
  positionsByAddress: Record<string, DefiPosition[]>;
  accounts: Account[];
  isLoading: boolean;
  isFetching: boolean;
  isPlaceholderData: boolean;
  isSuccess: boolean;
  error: Error | null;
  updatedAt: number | null;
  refetch: () => void;
}

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
  addresses: string[];
  addressParam: keyof AddressQueryParams;
}

export const usePositionsData = ({
  filter,
}: UsePositionsDataProps): UsePositionsDataResult => {
  const pathname = usePathnameWithoutLocale();
  const isEnabled = isCurrentPageUsingPositionData(pathname);
  const { accounts } = useAccount();

  const connectedAccounts = useMemo(
    () => accounts.filter((acc) => acc.isConnected && acc.address) as Account[],
    [accounts],
  );

  const addresses = useMemo(
    () => connectedAccounts.map((acc) => acc.address as Hex),
    [connectedAccounts],
  );

  const accountGroups = useAccountGroupsByChainType(connectedAccounts);

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
    queries: accountGroups.map(({ addressParam, addresses: batch }) => ({
      queryKey: ['portfolio-positions', addressParam, batch, filter],
      queryFn: async (): Promise<QueryData> => {
        shouldSetCacheRef.current = shouldUseCache;
        const result = await getPositionsForAddresses({
          ...filter,
          [addressParam]: batch,
        });
        return { ...result.data, addresses: batch, addressParam };
      },
      enabled: isEnabled && batch.length > 0,
      refetchInterval: ONE_HOUR_MS,
      placeholderData: shouldUseCache
        ? (): QueryData | undefined => {
            const cachedChunks = batch.map((addr) => getPositions(addr));
            if (!cachedChunks.some((c) => c.length > 0)) {
              return undefined;
            }
            return {
              data: batch.flatMap((addr) => getPositions(addr)),
              meta: { updatedAt: '' },
              addresses: batch,
              addressParam,
            };
          }
        : undefined,
    })),
  });

  useEffect(() => {
    if (!shouldUseCache || !shouldSetCacheRef.current) {
      return;
    }
    shouldSetCacheRef.current = false;

    for (const query of queries) {
      if (!query.isSuccess || !query.data || query.isPlaceholderData) {
        continue;
      }
      const { addresses: batch, data: positions } = query.data;
      const byAddress = groupBy(positions, (p) => p.address.toLowerCase());
      for (const addr of batch) {
        setPositionsCache(addr, byAddress[addr.toLowerCase()] ?? []);
      }
    }
  }, [queries, setPositionsCache, shouldUseCache]);

  useEffect(() => {
    if (wasCachePatched) {
      setLastPatchVersion(positionPatchVersion);
    }
  }, [positionPatchVersion, wasCachePatched]);

  const isLoading = queries.some((q) => q.isLoading);
  const isFetching = queries.some((q) => q.isFetching);
  const isPlaceholderData = queries.some((q) => q.isPlaceholderData);
  const isSuccess = queries.every((q) => q.isSuccess);
  const error = (queries.find((q) => q.error)?.error as Error) ?? null;

  const successfulQueries = useMemo(
    () => queries.filter((q) => q.isSuccess && q.data),
    [queries],
  );

  const positions = useMemo((): DefiPosition[] => {
    if (wasCachePatched && shouldUseCache) {
      return addresses.flatMap((addr) => getPositions(addr));
    }
    return successfulQueries.flatMap((q) => q.data?.data ?? []);
  }, [
    successfulQueries,
    wasCachePatched,
    shouldUseCache,
    addresses,
    getPositions,
  ]);

  const positionsByAddress = useMemo((): Record<string, DefiPosition[]> => {
    if (wasCachePatched && shouldUseCache) {
      return Object.fromEntries(
        addresses.map((addr) => [addr, getPositions(addr)]),
      );
    }

    const allPositions = successfulQueries.flatMap((q) => q.data?.data ?? []);
    const byAddress = groupBy(allPositions, (p) => p.address.toLowerCase());

    return Object.fromEntries(
      addresses.map((addr) => [addr, byAddress[addr.toLowerCase()] ?? []]),
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
    const dates = successfulQueries.map((q) => {
      const metaUpdatedAt = q.data?.meta?.updatedAt;
      return metaUpdatedAt
        ? new Date(metaUpdatedAt)
        : new Date(q.dataUpdatedAt);
    });
    return min(dates).getTime();
  }, [successfulQueries]);

  const refetch = useCallback(() => {
    queries.forEach((q) => q.refetch());
  }, [queries]);

  return {
    positions,
    positionsByAddress,
    accounts: connectedAccounts,
    isLoading,
    isFetching,
    isPlaceholderData,
    isSuccess,
    error,
    updatedAt,
    refetch,
  };
};
