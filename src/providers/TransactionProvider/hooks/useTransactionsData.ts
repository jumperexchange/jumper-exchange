import { useQuery } from '@tanstack/react-query';
import { useMemo, useRef, useCallback } from 'react';
import { useAccount } from '@lifi/wallet-management';
import { makeClient } from '@/app/lib/client';
import { useAccountGroupsByChainType } from '@/hooks/accounts/useAccountGroupsByChainType';
import type {
  TransactionsDtoResponse,
  TransactionsDto,
} from '@/types/jumper-backend';

export interface RateLimitInfo {
  forceRefreshRemaining: number | null;
  resetAt: string | null;
}

interface UseTransactionsDataProps {
  walletAddress?: string | null;
  minDate?: string | null;
  maxDate?: string | null;
  cursor?: string | null;
  chainIds?: number[];
  types?: TransactionsDto['action'][];
  assets?: string[];
  enabled?: boolean;
}

function parseRateLimit(headers: Headers): RateLimitInfo {
  const remaining = headers.get('x-ratelimit-forcerefresh-remaining');
  const reset = headers.get('x-ratelimit-reset');
  return {
    forceRefreshRemaining: remaining !== null ? parseInt(remaining, 10) : null,
    resetAt: reset,
  };
}

export const useTransactionsData = ({
  walletAddress,
  minDate,
  maxDate,
  cursor,
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

  const forceRefreshRef = useRef(false);
  const rateLimitRef = useRef<RateLimitInfo | null>(null);

  const { data, isLoading, error, refetch } = useQuery<TransactionsDtoResponse>(
    {
      queryKey: [
        'portfolio-transactions',
        walletAddress,
        minDate,
        maxDate,
        cursor,
        chainIds,
        types,
        assets,
      ],
      queryFn: async () => {
        const shouldForceRefresh = forceRefreshRef.current;
        forceRefreshRef.current = false;
        const client = makeClient();
        const res = await client.v1.portfolioControllerGetUserTransactionsV1({
          ...addressParams,
          minDate: minDate ?? undefined,
          maxDate: maxDate ?? undefined,
          next: cursor ?? undefined,
          chains: chainIds?.length ? chainIds : undefined,
          types: types?.length ? types : undefined,
          assets: assets?.length ? assets : undefined,
          forceRefresh: shouldForceRefresh || undefined,
        });
        rateLimitRef.current = parseRateLimit(res.headers);
        return res.data;
      },
      enabled: hasAddress && enabled,
    },
  );

  const triggerForceRefresh = useCallback(() => {
    forceRefreshRef.current = true;
    refetch();
  }, [refetch]);

  return {
    data,
    isLoading,
    error,
    refetch,
    triggerForceRefresh,
    rateLimit: rateLimitRef.current,
  };
};
