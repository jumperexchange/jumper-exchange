import { useCallback, useMemo, useRef } from 'react';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import type { Account } from '@lifi/wallet-management';
import { useAccount } from '@lifi/wallet-management';
import type { ChainType } from '@lifi/sdk';
import { compact, max } from 'lodash';
import { fetchBalancesForAddress } from '../lib/fetchBalancesForAddresses';
import { usePortfolioCacheStore } from '@/stores/portfolio/PortfolioCacheStore';
import type { BatchFetcherControl } from '@/utils/batches/fetcher';
import type { TokenBalance } from '@/types/tokens';

export interface UseTokensDataResult {
  balances: TokenBalance[];
  balancesByAddress: Record<string, TokenBalance[]>;
  accounts: Account[];
  isLoading: boolean;
  isFetching: boolean;
  isPlaceholderData: boolean;
  error: Error | null;
  round: number;
  updatedAt: number | null;
  refetch: () => void;
  cancel: () => void;
}

interface TokenQueryData {
  balances: TokenBalance[];
  round: number;
  updatedAt: number | null;
}

export const useBalancesData = (): UseTokensDataResult => {
  const { accounts } = useAccount();
  const queryClient = useQueryClient();
  const getBalancesFromCache = usePortfolioCacheStore((s) => s.getBalances);
  const setBalancesInCache = usePortfolioCacheStore((s) => s.setBalances);
  const setNeedsRefresh = usePortfolioCacheStore((s) => s.setNeedsRefresh);
  const controlsRef = useRef<BatchFetcherControl[]>([]);

  const connectedAccounts = useMemo(
    () => accounts.filter((acc) => acc.isConnected && acc.address),
    [accounts],
  );

  const queries = useQueries({
    queries: connectedAccounts.map((account) => ({
      queryKey: ['portfolio-tokens', account.address],
      queryFn: async (): Promise<TokenQueryData> => {
        let lastRound = 0;
        const result = await fetchBalancesForAddress({
          address: account.address!,
          chainType: account.chainType as ChainType,
          onProgress: (round, fetchedTokens) => {
            lastRound = round;
            const updatedAt = Date.now();
            queryClient.setQueryData<TokenQueryData>(
              ['portfolio-tokens', account.address],
              {
                balances: fetchedTokens,
                round,
                updatedAt,
              },
            );
            setBalancesInCache(account.address!, fetchedTokens);
          },
          onComplete: (fetchedTokens) => {
            const updatedAt = Date.now();
            queryClient.setQueryData<TokenQueryData>(
              ['portfolio-tokens', account.address],
              {
                balances: fetchedTokens,
                round: lastRound,
                updatedAt,
              },
            );
            setBalancesInCache(account.address!, fetchedTokens);
            setNeedsRefresh(account.address!, false);
          },
        });

        if (result.control) {
          controlsRef.current.push(result.control);
        }

        return {
          balances: result.balances,
          round: lastRound,
          updatedAt: Date.now(),
        };
      },
      staleTime: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      placeholderData: (): TokenQueryData | undefined => {
        const cached = getBalancesFromCache(account.address!);
        if (cached.length > 0) {
          return {
            balances: cached,
            round: 0,
            updatedAt: null,
          };
        }
        return undefined;
      },
    })),
  });

  const refetch = useCallback(() => {
    controlsRef.current.forEach((ctrl) => ctrl.cancel());
    controlsRef.current = [];
    queries.forEach((q) => q.refetch());
  }, [queries]);

  const cancel = useCallback(() => {
    controlsRef.current.forEach((ctrl) => ctrl.cancel());
    controlsRef.current = [];
    queryClient.cancelQueries({ queryKey: ['portfolio-tokens'] });
  }, [queryClient]);

  const balancesByAddress = useMemo(() => {
    return queries.reduce(
      (acc, query, index) => {
        const address = connectedAccounts[index]?.address;
        const data = query.data;
        if (address && data?.balances) {
          acc[address] = data.balances;
        }
        return acc;
      },
      {} as Record<string, TokenBalance[]>,
    );
  }, [queries, connectedAccounts]);

  const balances = useMemo(
    () => Object.values(balancesByAddress).flat(),
    [balancesByAddress],
  );

  const round = useMemo(() => {
    const rounds = compact(queries.map((q) => q.data?.round ?? 0));
    return rounds.length > 0 ? (max(rounds) ?? 0) : 0;
  }, [queries]);

  const updatedAt = useMemo(() => {
    const timestamps = compact(queries.map((q) => q.data?.updatedAt ?? null));
    return timestamps.length > 0 ? (max(timestamps) ?? null) : null;
  }, [queries]);

  const isLoading = queries.some((q) => q.isLoading);
  const isFetching = queries.some((q) => q.isFetching);
  const isPlaceholderData = queries.some((q) => q.isPlaceholderData);
  const error =
    (queries.find((q) => q.error)?.error as Error | null | undefined) ?? null;

  return {
    balances,
    balancesByAddress,
    accounts: connectedAccounts,
    isLoading,
    isFetching,
    isPlaceholderData,
    error,
    round,
    updatedAt,
    refetch,
    cancel,
  };
};
