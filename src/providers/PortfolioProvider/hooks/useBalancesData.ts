import { useCallback, useMemo } from 'react';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import type { Account } from '@lifi/widget-provider';
import { useAccount } from '@lifi/wallet-management';
import type { ChainType } from '@lifi/sdk';
import { compact, max } from 'lodash';
import { fetchBalancesForAddress } from '../lib/fetchBalancesForAddresses';
import { usePortfolioCacheStore } from '@/stores/portfolio/PortfolioCacheStore';
import type { TokenBalance } from '@/types/tokens';

export interface ResultState {
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isPlaceholderData: boolean;
  updatedAt: number | null;
  error: Error | null;
}

export interface UseTokensDataResult extends ResultState {
  balances: TokenBalance[];
  balancesByAddress: Record<string, TokenBalance[]>;
  accounts: Account[];
  error: Error | null;
  round: number;
  refetch: () => void;
  cancel: () => void;
  refetchForAddress: (address: string) => void;
  stateByAddress: Record<string, ResultState>;
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

  const connectedAccounts = useMemo(
    () => accounts.filter((acc) => acc.isConnected && acc.address),
    [accounts],
  );

  const addresses = useMemo(
    () => connectedAccounts.map((acc) => acc.address),
    [connectedAccounts],
  );

  const queries = useQueries({
    queries: connectedAccounts.map((account) => ({
      queryKey: ['portfolio-tokens', account.address],
      queryFn: async ({ signal }): Promise<TokenQueryData> => {
        let lastRound = 0;

        const result = await fetchBalancesForAddress({
          address: account.address!,
          chainType: account.chainType as ChainType,
          signal,
          onProgress: (completedBatches, _totalBatches, fetchedTokens) => {
            lastRound = completedBatches;
            const updatedAt = Date.now();

            // Update cache during progress
            queryClient.setQueryData<TokenQueryData>(
              ['portfolio-tokens', account.address],
              {
                balances: fetchedTokens,
                round,
                updatedAt,
              },
            );
          },
          onComplete: (fetchedTokens) => {
            if (fetchedTokens.length) {
              setBalancesInCache(account.address!, fetchedTokens);
            }

            setNeedsRefresh(account.address!, false);
          },
        });

        const updatedAt = Date.now();

        const finalBalances = result.balances.length
          ? result.balances
          : getBalancesFromCache(account.address!);

        return {
          balances: finalBalances,
          round: lastRound,
          updatedAt: updatedAt,
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
    queryClient.cancelQueries({ queryKey: ['portfolio-tokens'] });
    queries.forEach((q) => q.refetch());
  }, [queries, queryClient]);

  const cancel = useCallback(() => {
    queryClient.cancelQueries({ queryKey: ['portfolio-tokens'] });
  }, [queryClient]);

  const refetchForAddress = useCallback(
    (address: string) => {
      const queryIndex = addresses.findIndex(
        (addr) => addr?.toLowerCase() === address.toLowerCase(),
      );

      queryClient.cancelQueries({
        queryKey: ['portfolio-tokens', address],
      });

      if (queryIndex !== -1) {
        queries[queryIndex]?.refetch();
      }
    },
    [queries, addresses, queryClient],
  );

  const balancesByAddress = useMemo(() => {
    return queries.reduce(
      (acc, query, index) => {
        const address = addresses[index];
        const data = query.data;
        if (address && data?.balances) {
          acc[address] = data.balances;
        }
        return acc;
      },
      {} as Record<string, TokenBalance[]>,
    );
  }, [queries, addresses]);

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

  const stateByAddress = useMemo(() => {
    return queries.reduce(
      (acc, query, index) => {
        const address = addresses[index];

        if (address) {
          acc[address] = {
            isFetching: query.isFetching,
            isLoading: query.isLoading,
            isSuccess: query.isSuccess,
            isPlaceholderData: query.isPlaceholderData,
            updatedAt: query.data?.updatedAt ?? null,
            error: query.error,
          };
        }

        return acc;
      },
      {} as Record<string, ResultState>,
    );
  }, [queries, addresses]);

  const isLoading = queries.some((q) => q.isLoading);
  const isFetching = queries.some((q) => q.isFetching);
  const isPlaceholderData = queries.some((q) => q.isPlaceholderData);
  const isSuccess = queries.every((q) => q.isSuccess);
  const error = (queries.find((q) => q.error)?.error as Error | null) ?? null;

  return {
    balances,
    balancesByAddress,
    accounts: connectedAccounts,
    isLoading,
    isFetching,
    isPlaceholderData,
    isSuccess,
    error,
    round,
    updatedAt,
    stateByAddress,
    refetch,
    cancel,
    refetchForAddress,
  };
};
