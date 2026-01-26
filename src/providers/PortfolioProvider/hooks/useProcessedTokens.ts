'use client';

import { useMemo } from 'react';
import { mapValues } from 'lodash';
import { useChains } from '@/hooks/useChains';
import { usePriceLookup } from './usePriceLookup';
import { useBalancesData } from './useBalancesData';
import type { Account } from '@lifi/wallet-management';
import {
  toPortfolioBalances,
  groupTokens,
  dedupTokensFromLpPositions,
} from '../utils/tokens';
import { extractTokensMetadata } from '../utils/metadata';
import type { PortfolioTokenGroup } from '../types/tokens';
import type { TokensMetadata } from '../types/metadata';
import type { LpTokenIdentifier } from '../types/positions';
import { useTokenFormatters } from '@/hooks/useTokenFormatters';

export interface ProcessedTokensResult {
  tokens: PortfolioTokenGroup[];
  tokensByAddress: Record<string, PortfolioTokenGroup[]>;
  tokensBySymbol: PortfolioTokenGroup[];
  tokensByChain: PortfolioTokenGroup[];
  accounts: Account[];
  metadata: TokensMetadata;
  isEmpty: boolean;
  isLoading: boolean;
  error: Error | null;
  round: number;
  updatedAt: number | null;
  refetch: () => void;
}

export interface UseProcessedTokensParams {
  lpTokens?: LpTokenIdentifier[];
}

export const useProcessedTokens = ({
  lpTokens = [],
}: UseProcessedTokensParams = {}): ProcessedTokensResult => {
  const rawData = useBalancesData();

  const balances = useMemo(
    () => toPortfolioBalances(rawData.balances),
    [rawData.balances],
  );

  const balancesByAddress = useMemo(() => {
    return mapValues(rawData.balancesByAddress, toPortfolioBalances);
  }, [rawData.balancesByAddress]);

  // TODO make lpTokens as PortfolioBalance
  const dedupedTokens = useMemo(
    () => dedupTokensFromLpPositions(balances, lpTokens),
    [balances, lpTokens],
  );

  const dedupedTokensByAddress = useMemo(
    () =>
      mapValues(balancesByAddress, (balances) =>
        dedupTokensFromLpPositions(balances, lpTokens),
      ),
    [balancesByAddress, lpTokens],
  );

  // const bySymbol = useMemo(
  //   () => groupTokens(dedupedTokens, 'bySymbol'),
  //   [dedupedTokens],
  // );

  // const bySymbolByAddress = useMemo(
  //   () =>
  //     mapValues(dedupedTokensByAddress, (tokens) =>
  //       groupTokens(tokens, 'bySymbol'),
  //     ),
  //   [dedupedTokensByAddress],
  // );

  // const byChain = useMemo(
  //   () => groupTokens(dedupedTokens, 'byChain'),
  //   [dedupedTokens],
  // );

  // FIXME: Implement metadata extraction
  // const metadata = useMemo(
  //   () => extractTokensMetadata(dedupedTokens, rawData.accounts),
  //   [dedupedTokens, rawData.accounts],
  // );

  return {
    tokens: [],
    tokensByAddress: {},
    tokensBySymbol: [],
    tokensByChain: [],
    accounts: rawData.accounts,
    metadata: {
      wallets: [],
      chains: [],
      assets: [],
      valueRange: { min: 0, max: 0 },
    },
    isEmpty: dedupedTokens.length === 0,
    isLoading: rawData.isLoading,
    error: rawData.error,
    round: rawData.round,
    updatedAt: rawData.updatedAt,
    refetch: rawData.refetch,
  };
};
