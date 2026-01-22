'use client';

import { useCallback, useMemo } from 'react';
import type { PortfolioStateContextValue } from '../PortfolioContext.types';

export interface UsePortfolioStateParams {
  isLoadingTokens: boolean;
  isLoadingPositions: boolean;
  isLoadingPrices: boolean;
  hasFreshPrices: boolean;
  pricesUpdatedAt: number | undefined;
  tokensError: Error | null;
  positionsError: Error | null;
  refetchTokens: () => void;
  refetchPositions: () => void;
}

export const usePortfolioState = ({
  isLoadingTokens,
  isLoadingPositions,
  isLoadingPrices,
  hasFreshPrices,
  pricesUpdatedAt,
  tokensError,
  positionsError,
  refetchTokens,
  refetchPositions,
}: UsePortfolioStateParams): PortfolioStateContextValue => {
  const refetchAll = useCallback(() => {
    refetchTokens();
    refetchPositions();
  }, [refetchTokens, refetchPositions]);

  return useMemo(
    () => ({
      isLoading: isLoadingTokens || isLoadingPositions,
      isLoadingTokens,
      isLoadingPositions,
      isLoadingPrices,
      hasFreshPrices,
      pricesUpdatedAt: pricesUpdatedAt ?? null,
      hasError: Boolean(tokensError || positionsError),
      refetchAll,
    }),
    [
      isLoadingTokens,
      isLoadingPositions,
      isLoadingPrices,
      hasFreshPrices,
      pricesUpdatedAt,
      tokensError,
      positionsError,
      refetchAll,
    ],
  );
};
