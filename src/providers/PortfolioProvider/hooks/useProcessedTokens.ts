'use client';

import { useMemo } from 'react';
import { mapValues } from 'lodash';
import { useChains } from '@/hooks/useChains';
import { usePriceLookup } from './usePriceLookup';
import { useTokensData } from './useTokensData';
import { normalizeTokens } from '../utils/normalizeTokens';
import { groupTokens } from '../utils/groupTokens';
import { dedupTokensFromLpPositions } from '../utils/dedupTokens';
import {
  extractTokensMetadata,
  type TokensMetadata,
} from '../utils/extractMetadata';
import type { LpTokenIdentifier } from '../utils/extractLpTokens';
import type { PortfolioTokenGroup } from '../types/PortfolioTokenGroup';
import type { Account } from '@lifi/wallet-management';

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
  const { chains } = useChains();
  const rawData = useTokensData();
  const { getPrice } = usePriceLookup();

  const normalizedTokens = useMemo(
    () =>
      normalizeTokens({
        tokens: rawData.tokens,
        chains,
        getPrice,
      }),
    [rawData.tokens, chains, getPrice],
  );

  const tokensByAddress = useMemo(
    () =>
      mapValues(rawData.tokensByAddress, (addressTokens) =>
        normalizeTokens({
          tokens: addressTokens,
          chains,
          getPrice,
        }),
      ),
    [rawData.tokensByAddress, chains, getPrice],
  );

  const dedupedTokens = useMemo(
    () => dedupTokensFromLpPositions(normalizedTokens, lpTokens),
    [normalizedTokens, lpTokens],
  );

  const dedupedTokensByAddress = useMemo(
    () =>
      mapValues(tokensByAddress, (tokens) =>
        dedupTokensFromLpPositions(tokens, lpTokens),
      ),
    [tokensByAddress, lpTokens],
  );

  const bySymbol = useMemo(
    () => groupTokens(dedupedTokens, 'bySymbol'),
    [dedupedTokens],
  );

  const bySymbolByAddress = useMemo(
    () =>
      mapValues(dedupedTokensByAddress, (tokens) =>
        groupTokens(tokens, 'bySymbol'),
      ),
    [dedupedTokensByAddress],
  );

  const byChain = useMemo(
    () => groupTokens(dedupedTokens, 'byChain'),
    [dedupedTokens],
  );

  const metadata = useMemo(
    () => extractTokensMetadata(dedupedTokens, rawData.accounts),
    [dedupedTokens, rawData.accounts],
  );

  return {
    tokens: bySymbol,
    tokensByAddress: bySymbolByAddress,
    tokensBySymbol: bySymbol,
    tokensByChain: byChain,
    accounts: rawData.accounts,
    metadata,
    isEmpty: dedupedTokens.length === 0,
    isLoading: rawData.isLoading,
    error: rawData.error,
    round: rawData.round,
    updatedAt: rawData.updatedAt,
    refetch: rawData.refetch,
  };
};
