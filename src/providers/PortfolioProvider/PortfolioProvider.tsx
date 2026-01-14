'use client';

import type { PropsWithChildren } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PortfolioContext } from './PortfolioContext';
import type { PortfolioContextValue } from './PortfolioContext.types';
import { useTokensData } from './hooks/useTokensData';
import { usePositionsData } from './hooks/usePositionsData';
import { usePricesData } from './hooks/usePricesData';
import { useChains } from '@/hooks/useChains';
import { augmentTokens } from './pipeline/tokens.augment';
import { dedupTokensFromLpPositions } from './pipeline/tokens.dedup';
import { groupTokensBySymbol } from './pipeline/tokens.group';
import { normalizeGroupedTokens } from './pipeline/tokens.normalize';
import { augmentPositions } from './pipeline/positions.augment';
import {
  groupPositionsByProtocol,
  groupPositionsByProtocolAndChain,
} from './pipeline/positions.group';
import {
  extractLpTokens,
  type LpTokenIdentifier,
} from './pipeline/positions.lpTokens';
import {
  extractTokensMetadata,
  extractPositionsMetadata,
} from './pipeline/metadata';
import mapValues from 'lodash/mapValues';
import type { PortfolioAccount } from './types/tokens.types';
import { positionQueryRegistry } from './registry/PositionQueryRegistry';
import { processSummary } from './pipeline/summary';

export const PortfolioProvider = ({ children }: PropsWithChildren) => {
  const { chains } = useChains();
  const tokensData = useTokensData();
  const positionsData = usePositionsData();
  const { getTokenPrice } = usePricesData();

  const [activeQueries, setActiveQueries] = useState(() =>
    positionQueryRegistry.getActiveQueries(),
  );

  useEffect(() => {
    const unsubscribe = positionQueryRegistry.onQueriesChange(() => {
      setActiveQueries(positionQueryRegistry.getActiveQueries());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const processPositionsData = useCallback(
    (rawData: ReturnType<typeof usePositionsData>) => {
      // Step 1: Augment with fresh price calculations
      const augmented = augmentPositions(rawData.positions, getTokenPrice);
      const augmentedByAddress = mapValues(
        rawData.positionsByAddress,
        (positions) => augmentPositions(positions, getTokenPrice),
      );

      // Step 2: Group by protocol and protocol-chain
      const byProtocol = groupPositionsByProtocol(augmented);
      const byProtocolAndChain = groupPositionsByProtocolAndChain(augmented);
      const byAddressAndProtocolAndChain = mapValues(
        augmentedByAddress,
        (positions) => groupPositionsByProtocolAndChain(positions),
      );

      // Step 3: Extract metadata for filtering UI
      const metadata = extractPositionsMetadata(augmented);

      // Return processed data with all transformations applied
      return {
        ...rawData,
        positions: augmented,
        positionsByAddress: augmentedByAddress,
        positionsByProtocolAndChain: byProtocolAndChain,
        positionsByProtocol: byProtocol,
        metadata,
        isEmpty: augmented.length === 0,
      };
    },
    [getTokenPrice],
  );

  const processTokensData = useCallback(
    (
      rawData: ReturnType<typeof useTokensData>,
      lpTokens: LpTokenIdentifier[] = [],
    ) => {
      const accounts = rawData.accounts.filter(
        (account) => account.address,
      ) as PortfolioAccount[];

      // Step 1: Augment with chain info
      const augmented = augmentTokens(rawData.tokens, chains);
      const augmentedByAddress = mapValues(rawData.tokensByAddress, (tokens) =>
        augmentTokens(tokens, chains),
      );

      // Step 2: Dedup LP tokens BEFORE grouping to ensure correct groupings
      const deduped = dedupTokensFromLpPositions(augmented, lpTokens);
      const dedupedByAddress = mapValues(augmentedByAddress, (tokens) =>
        dedupTokensFromLpPositions(tokens, lpTokens),
      );

      // Step 3: Group by symbol
      const grouped = groupTokensBySymbol(deduped);
      const groupedByAddress = mapValues(dedupedByAddress, (tokens) =>
        groupTokensBySymbol(tokens),
      );

      // Step 4: Normalize grouped tokens to PortfolioToken[]
      const normalized = normalizeGroupedTokens(grouped);
      const normalizedByAddress = mapValues(groupedByAddress, (tokens) =>
        normalizeGroupedTokens(tokens),
      );

      // Step 5: Extract metadata for filtering UI (from deduplicated tokens)
      const metadata = extractTokensMetadata(deduped, rawData.accounts);

      // Return processed data with all transformations applied
      return {
        ...rawData,
        tokens: normalized,
        tokensByAddress: normalizedByAddress,
        metadata,
        isEmpty: normalized.length === 0,
        accounts,
      };
    },
    [chains],
  );

  // Process positions first to get LP tokens for dedup
  const processedMainPositions = useMemo(
    () => processPositionsData(positionsData),
    [positionsData, processPositionsData],
  );

  // Extract LP tokens from positions for token deduplication
  const lpTokens = useMemo(
    () => extractLpTokens(processedMainPositions.positions),
    [processedMainPositions.positions],
  );

  // Process tokens with LP token deduplication
  const processedMainTokens = useMemo(
    () => processTokensData(tokensData, lpTokens),
    [tokensData, processTokensData, lpTokens],
  );

  const processedSummary = useMemo(() => {
    return processSummary(
      processedMainTokens.tokens,
      processedMainPositions.positionsByProtocol,
    );
  }, [processedMainTokens.tokens, processedMainPositions.positionsByProtocol]);

  const contextValue: PortfolioContextValue = useMemo(
    () => ({
      summary: processedSummary,
      tokens: {
        tokens: processedMainTokens.tokens,
        tokensByAddress: processedMainTokens.tokensByAddress,
        accounts: processedMainTokens.accounts,
        metadata: processedMainTokens.metadata,
        updatedAt: processedMainTokens.updatedAt,
        isEmpty: processedMainTokens.isEmpty,
        isLoading: processedMainTokens.isLoading,
        error: processedMainTokens.error,
        round: processedMainTokens.round,
        refetch: processedMainTokens.refetch,
      },
      positions: {
        positions: processedMainPositions.positions,
        positionsByAddress: processedMainPositions.positionsByAddress,
        positionsByProtocolAndChain:
          processedMainPositions.positionsByProtocolAndChain,
        positionsByProtocol: processedMainPositions.positionsByProtocol,
        metadata: processedMainPositions.metadata,
        isEmpty: processedMainPositions.isEmpty,
        isLoading: processedMainPositions.isLoading,
        error: processedMainPositions.error,
        updatedAt: processedMainPositions.updatedAt,
        refetch: processedMainPositions.refetch,
      },
      state: {
        isLoading:
          processedMainTokens.isLoading || processedMainPositions.isLoading,
        isLoadingTokens: processedMainTokens.isLoading,
        isLoadingPositions: processedMainPositions.isLoading,
        hasError: Boolean(
          processedMainTokens.error || processedMainPositions.error,
        ),
        refetchAll: () => {
          processedMainTokens.refetch();
          processedMainPositions.refetch();
        },
      },
      processors: {
        positions: processPositionsData,
        tokens: processTokensData,
      },
    }),
    [
      processedSummary,
      processedMainTokens,
      processedMainPositions,
      processPositionsData,
      processTokensData,
    ],
  );

  return (
    <PortfolioContext.Provider value={contextValue}>
      {children}
    </PortfolioContext.Provider>
  );
};
