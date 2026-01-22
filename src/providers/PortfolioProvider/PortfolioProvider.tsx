'use client';

import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';
import { PortfolioContext } from './PortfolioContext';
import { useInitializePortfolioFormatters } from './hooks/usePortfolioFormatters';
import type { PortfolioContextValue } from './PortfolioContext.types';
import { useProcessedPositions } from './hooks/useProcessedPositions';
import { useProcessedTokens } from './hooks/useProcessedTokens';
import { usePortfolioSummary } from './hooks/usePortfolioSummary';
import { usePortfolioState } from './hooks/usePortfolioState';
import { usePriceLookup } from './hooks/usePriceLookup';

export const PortfolioProvider = ({ children }: PropsWithChildren) => {
  useInitializePortfolioFormatters();

  const {
    isLoading: isLoadingPrices,
    hasFreshPrices,
    updatedAt: pricesUpdatedAt,
  } = usePriceLookup();

  const positions = useProcessedPositions();

  const tokens = useProcessedTokens({
    lpTokens: positions.lpTokens,
  });

  const summary = usePortfolioSummary({
    tokensBySymbol: tokens.tokensBySymbol,
    positionsByProtocol: positions.positionsByProtocol,
  });

  const state = usePortfolioState({
    isLoadingTokens: tokens.isLoading,
    isLoadingPositions: positions.isLoading,
    isLoadingPrices,
    hasFreshPrices,
    pricesUpdatedAt,
    tokensError: tokens.error,
    positionsError: positions.error,
    refetchTokens: tokens.refetch,
    refetchPositions: positions.refetch,
  });

  const contextValue: PortfolioContextValue = useMemo(
    () => ({
      summary,
      tokens,
      positions,
      state,
    }),
    [summary, tokens, positions, state],
  );

  return (
    <PortfolioContext.Provider value={contextValue}>
      {children}
    </PortfolioContext.Provider>
  );
};
