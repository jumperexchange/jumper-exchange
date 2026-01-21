'use client';

import type { PropsWithChildren } from 'react';
import { useCallback, useMemo } from 'react';
import { PortfolioContext } from './PortfolioContext';
import { useInitializePortfolioFormatters } from './hooks/usePortfolioFormatters';
import type { PortfolioContextValue } from './PortfolioContext.types';
import { useTokensData } from './hooks/useTokensData';
import { usePositionsData } from './hooks/usePositionsData';
import { usePriceLookup } from './hooks/usePriceLookup';
import { useChains } from '@/hooks/useChains';
import {
  extractLpTokens,
  type LpTokenIdentifier,
} from './pipeline/positions.lpTokens';
import { dedupTokensFromLpPositions } from './pipeline/tokens.dedup';
import {
  extractPositionsMetadata,
  extractTokensMetadata,
} from './pipeline/metadata';
import { normalizeTokens } from './pipeline/tokens.normalize';
import { normalizePositions } from './pipeline/positions.normalize';
import { mapValues } from 'lodash';
import { groupPositions } from './pipeline/positions.group';
import { groupTokens } from './pipeline/tokens.group';
import { processSummary } from './pipeline/summary';

export const PortfolioProvider = ({ children }: PropsWithChildren) => {
  const { chains } = useChains();
  const tokensData = useTokensData();
  const positionsData = usePositionsData();
  const {
    getPrice,
    isLoading: isLoadingPrices,
    hasFreshPrices,
    updatedAt: pricesUpdatedAt,
  } = usePriceLookup();

  useInitializePortfolioFormatters();

  const processPositionsData = useCallback(
    (rawData: ReturnType<typeof usePositionsData>) => {
      const positions = normalizePositions(rawData.positions, getPrice);
      const positionsByAddress = mapValues(
        rawData.positionsByAddress,
        (positions) => normalizePositions(positions, getPrice),
      );
      const byProtocolAndChain = groupPositions(
        positions,
        'byProtocolAndChain',
      );
      const byProtocol = groupPositions(positions, 'byProtocol');
      const metadata = extractPositionsMetadata(positions);

      return {
        ...rawData,
        positions,
        positionsByAddress,
        positionsByProtocolAndChain: byProtocolAndChain,
        positionsByProtocol: byProtocol,
        metadata,
        isEmpty: positions.length === 0,
      };
    },
    [getPrice],
  );

  const processTokensData = useCallback(
    (
      rawData: ReturnType<typeof useTokensData>,
      lpTokens: LpTokenIdentifier[] = [],
    ) => {
      const tokens = normalizeTokens({
        tokens: rawData.tokens,
        chains,
        getPrice,
      });

      const tokensByAddress = mapValues(rawData.tokensByAddress, (tokens) =>
        normalizeTokens({
          tokens,
          chains,
          getPrice,
        }),
      );

      const dedupedTokens = dedupTokensFromLpPositions(tokens, lpTokens);
      const dedupedTokensByAddress = mapValues(tokensByAddress, (tokens) =>
        dedupTokensFromLpPositions(tokens, lpTokens),
      );
      const bySymbol = groupTokens(dedupedTokens, 'bySymbol');
      const bySymbolByAddress = mapValues(dedupedTokensByAddress, (tokens) =>
        groupTokens(tokens, 'bySymbol'),
      );
      const byChain = groupTokens(dedupedTokens, 'byChain');
      const metadata = extractTokensMetadata(dedupedTokens, rawData.accounts);

      return {
        ...rawData,
        tokens: bySymbol,
        tokensByAddress: bySymbolByAddress,
        tokensBySymbol: bySymbol,
        tokensByChain: byChain,
        metadata,
        isEmpty: dedupedTokens.length === 0,
      };
    },
    [chains, getPrice],
  );

  const processedMainPositions = useMemo(
    () => processPositionsData(positionsData),
    [positionsData, processPositionsData],
  );

  const lpTokens = useMemo(
    () => extractLpTokens(processedMainPositions.positions),
    [processedMainPositions.positions],
  );

  const processedMainTokens = useMemo(
    () => processTokensData(tokensData, lpTokens),
    [tokensData, processTokensData, lpTokens],
  );

  const summary = useMemo(
    () =>
      processSummary(
        processedMainTokens.tokensBySymbol,
        processedMainPositions.positionsByProtocol,
      ),
    [
      processedMainTokens.tokensBySymbol,
      processedMainPositions.positionsByProtocol,
    ],
  );

  const contextValue: PortfolioContextValue = useMemo(
    () => ({
      summary,
      tokens: {
        tokens: processedMainTokens.tokens,
        tokensByAddress: processedMainTokens.tokensByAddress,
        tokensBySymbol: processedMainTokens.tokensBySymbol,
        tokensByChain: processedMainTokens.tokensByChain,
        accounts: processedMainTokens.accounts,
        metadata: processedMainTokens.metadata,
        updatedAt: processedMainTokens.updatedAt,
        isEmpty: processedMainTokens.tokens.length === 0,
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
        isEmpty: processedMainPositions.positions.length === 0,
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
        isLoadingPrices,
        hasFreshPrices,
        pricesUpdatedAt: pricesUpdatedAt ?? null,
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
      summary,
      processedMainTokens,
      processedMainPositions,
      isLoadingPrices,
      hasFreshPrices,
      pricesUpdatedAt,
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
