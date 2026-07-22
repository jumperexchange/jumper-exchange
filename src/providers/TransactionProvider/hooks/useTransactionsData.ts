import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useRef, useCallback } from 'react';
import { useAccount } from '@jumperexchange/wallet-management';
import { makeClient } from '@/app/lib/client';
import { useAccountGroupsByChainType } from '@/hooks/accounts/useAccountGroupsByChainType';
import type {
  TransactionsDtoResponse,
  TransactionsDto,
} from '@/types/jumper-backend';

export interface RateLimitInfo {
  forceRefreshRemaining: number | null;
  resetAt: Date | null;
}

interface TransactionsPageResult {
  transactions: TransactionsDtoResponse;
  rateLimit: RateLimitInfo;
}

interface UseTransactionsDataProps {
  walletAddress?: string | null;
  minDate?: string | null;
  maxDate?: string | null;
  chainIds?: number[];
  types?: TransactionsDto['action'][];
  assets?: string[];
  enabled?: boolean;
}

function parseResetAt(resetHeader: string | null): Date | null {
  if (resetHeader === null) {
    return null;
  }

  const resetSeconds = parseFloat(resetHeader);
  if (Number.isNaN(resetSeconds)) {
    return null;
  }

  return new Date(Date.now() + resetSeconds * 1000);
}

function parseRateLimit(headers: Headers): RateLimitInfo {
  const remaining = headers.get('x-ratelimit-forcerefresh-remaining');
  const reset = headers.get('x-ratelimit-reset');

  return {
    forceRefreshRemaining: remaining !== null ? parseInt(remaining, 10) : null,
    resetAt: parseResetAt(reset),
  };
}

export const useTransactionsData = ({
  walletAddress,
  minDate,
  maxDate,
  chainIds,
  types,
  assets,
  enabled = true,
}: UseTransactionsDataProps) => {
  const { accounts } = useAccount();
  const accountGroups = useAccountGroupsByChainType(accounts);

  const addressParams = useMemo(() => {
    if (!walletAddress) {
      return {};
    }

    const params: Record<string, string> = {};
    for (const { addressParam, addresses } of accountGroups) {
      if (addresses.includes(walletAddress)) {
        params[addressParam] = walletAddress;
        break;
      }
    }
    return params;
  }, [walletAddress, accountGroups]);

  const hasAddress = !!walletAddress && Object.keys(addressParams).length > 0;

  const queryClient = useQueryClient();
  const forceRefreshRef = useRef(false);

  const queryKey = useMemo(
    () =>
      [
        'portfolio-transactions',
        walletAddress,
        minDate,
        maxDate,
        chainIds,
        types,
        assets,
      ] as const,
    [walletAddress, minDate, maxDate, chainIds, types, assets],
  );

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useInfiniteQuery<
    TransactionsPageResult,
    Error,
    { pages: TransactionsPageResult[] },
    readonly unknown[],
    string | undefined
  >({
    queryKey,
    initialPageParam: undefined,
    queryFn: async ({ pageParam }) => {
      const shouldForceRefresh = forceRefreshRef.current;
      forceRefreshRef.current = false;
      const client = makeClient();
      const res = await client.v1.portfolioControllerGetUserTransactionsV1({
        ...addressParams,
        minDate: minDate ?? undefined,
        maxDate: maxDate ?? undefined,
        next: pageParam,
        chains: chainIds?.length ? chainIds : undefined,
        types: types?.length ? types : undefined,
        assets: assets?.length ? assets : undefined,
        forceRefresh: shouldForceRefresh || undefined,
      });

      return {
        transactions: res.data,
        rateLimit: parseRateLimit(res.headers),
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.transactions.meta?.next ?? undefined,
    enabled: hasAddress && enabled,
  });

  const triggerForceRefresh = useCallback(() => {
    forceRefreshRef.current = true;
    queryClient.resetQueries({ queryKey });
  }, [queryClient, queryKey]);

  return {
    data,
    rateLimit: data?.pages.at(-1)?.rateLimit ?? null,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
    triggerForceRefresh,
  };
};
