import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import type { Account } from '@lifi/wallet-management';
import { useAccount } from '@lifi/wallet-management';
import type { ChainType } from '@lifi/sdk';
import { compact, max } from 'lodash';
import {
  fetchTokensForAddress,
  type LiFiCommonToken,
} from '../datasources/tokens.datasource';
import { usePortfolioCacheStore } from '@/stores/portfolio/PortfolioCacheStore';

export interface UseTokensDataResult {
  tokens: LiFiCommonToken[];
  tokensByAddress: Record<string, LiFiCommonToken[]>;
  accounts: Account[];
  isLoading: boolean;
  error: Error | null;
  round: number;
  updatedAt: number | null;
  refetch: () => void;
  cancel: () => void;
}

interface TokenQueryData {
  tokens: LiFiCommonToken[];
  round: number;
  updatedAt: number | null;
}

export const useTokensData = (): UseTokensDataResult => {
  const { accounts } = useAccount();
  const queryClient = useQueryClient();
  const getTokens = usePortfolioCacheStore((s) => s.getTokens);
  const setTokensCache = usePortfolioCacheStore((s) => s.setTokens);
  const needsRefresh = usePortfolioCacheStore((s) => s.needsRefresh);
  const setNeedsRefresh = usePortfolioCacheStore((s) => s.setNeedsRefresh);
  const intervalIdsRef = useRef<NodeJS.Timeout[]>([]);

  const connectedAccounts = useMemo(
    () => accounts.filter((acc) => acc.isConnected && acc.address),
    [accounts],
  );

  // Seed cache from PortfolioCacheStore for connected accounts
  useEffect(() => {
    connectedAccounts.forEach((acc) => {
      const cachedTokens = getTokens(acc.address!);
      if (cachedTokens.length > 0) {
        queryClient.setQueryData<TokenQueryData>(
          ['portfolio-tokens', acc.address],
          {
            tokens: cachedTokens,
            round: 0,
            updatedAt: Date.now(),
          },
        );
      }
    });
  }, [connectedAccounts, getTokens, queryClient]);

  const refetch = useCallback(async () => {
    intervalIdsRef.current.forEach((id) => clearInterval(id));
    intervalIdsRef.current = [];
    await queryClient.invalidateQueries({ queryKey: ['portfolio-tokens'] });
  }, [queryClient]);

  // Auto-fetch on mount or when refresh is needed
  useEffect(() => {
    const shouldFetch = connectedAccounts.some(
      (acc) =>
        needsRefresh(acc.address!) || getTokens(acc.address!).length === 0,
    );
    if (shouldFetch && connectedAccounts.length > 0) {
      refetch();
    }
  }, [connectedAccounts, needsRefresh, getTokens, refetch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const queries = useQueries({
    queries: connectedAccounts.map((account) => ({
      queryKey: ['portfolio-tokens', account.address],
      queryFn: async (): Promise<TokenQueryData> => {
        let lastRound = 0;
        const result = await fetchTokensForAddress({
          address: account.address!,
          chainType: account.chainType as ChainType,
          onProgress: (round, fetchedTokens) => {
            lastRound = round;
            const updatedAt = Date.now();
            queryClient.setQueryData<TokenQueryData>(
              ['portfolio-tokens', account.address],
              {
                tokens: fetchedTokens,
                round,
                updatedAt,
              },
            );
            setTokensCache(account.address!, fetchedTokens);
          },
          onComplete: (fetchedTokens) => {
            const updatedAt = Date.now();
            queryClient.setQueryData<TokenQueryData>(
              ['portfolio-tokens', account.address],
              {
                tokens: fetchedTokens,
                round: lastRound,
                updatedAt,
              },
            );
            setTokensCache(account.address!, fetchedTokens);
            setNeedsRefresh(account.address!, false);
          },
        });

        if (result.intervalId) {
          intervalIdsRef.current.push(result.intervalId);
        }

        return {
          tokens: result.tokens,
          round: lastRound,
          updatedAt: Date.now(),
        };
      },
      staleTime: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    })),
  });

  const cancel = useCallback(() => {
    intervalIdsRef.current.forEach((id) => clearInterval(id));
    intervalIdsRef.current = [];
    queryClient.cancelQueries({ queryKey: ['portfolio-tokens'] });
  }, [queryClient]);

  const tokensByAddress = useMemo(() => {
    return queries.reduce(
      (acc, query, index) => {
        const address = connectedAccounts[index]?.address;
        const data = query.data;
        if (address && data?.tokens) {
          acc[address] = data.tokens;
        }
        return acc;
      },
      {} as Record<string, LiFiCommonToken[]>,
    );
  }, [queries, connectedAccounts]);

  const tokens = useMemo(
    () => Object.values(tokensByAddress).flat(),
    [tokensByAddress],
  );

  const round = useMemo(() => {
    const rounds = compact(queries.map((q) => q.data?.round ?? 0));
    return rounds.length > 0 ? (max(rounds) ?? 0) : 0;
  }, [queries]);

  const updatedAt = useMemo(() => {
    const timestamps = compact(queries.map((q) => q.data?.updatedAt ?? null));
    return timestamps.length > 0 ? (max(timestamps) ?? null) : null;
  }, [queries]);

  const isLoading = queries.some((q) => q.isLoading || q.isFetching);
  const error =
    (queries.find((q) => q.error)?.error as Error | null | undefined) ?? null;

  return {
    tokens,
    tokensByAddress,
    accounts: connectedAccounts,
    isLoading,
    error,
    round,
    updatedAt,
    refetch,
    cancel,
  };
};
