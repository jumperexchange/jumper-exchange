'use client';

import { useMemo, type PropsWithChildren } from 'react';
import {
  PortfolioContext,
  type BalancesState,
  type PositionsState,
} from './PortfolioContext';
import { useProcessBalances } from './hooks/useProcessBalances';
import { useProcessedPositions } from './hooks/useProcessPositions';
import { usePortfolioSummaryData } from './hooks/usePortfolioSummary';
import compact from 'lodash/compact';

export const PortfolioProvider = ({ children }: PropsWithChildren) => {
  const positionsData = useProcessedPositions({});
  const lpTokens = useMemo(
    () => compact(positionsData.lpTokens),
    [positionsData.lpTokens],
  );
  const balancesData = useProcessBalances(lpTokens);

  const balances: BalancesState = useMemo(
    () => ({
      balances: balancesData.balances,
      balancesByAddress: balancesData.balancesByAddress,
      metadata: balancesData.metadata,
      isLoading: balancesData.isLoading,
      error: balancesData.error,
      updatedAt: balancesData.updatedAt,
      refetch: balancesData.refetch,
      isEmpty: balancesData.isEmpty,
    }),
    [balancesData],
  );

  const positions: PositionsState = useMemo(
    () => ({
      positions: positionsData.positions,
      positionsByAddress: positionsData.positionsByAddress,
      positionsByProtocolAndChain: positionsData.positionsByProtocolAndChain,
      positionsByProtocol: positionsData.positionsByProtocol,
      metadata: positionsData.metadata,
      lpTokens: positionsData.lpTokens,
      isLoading: positionsData.isLoading,
      error: positionsData.error,
      updatedAt: positionsData.updatedAt,
      refetch: positionsData.refetch,
      isEmpty: positionsData.isEmpty,
    }),
    [positionsData],
  );

  const summary = usePortfolioSummaryData({
    balancesByAddress: balancesData.balancesByAddress,
    positions: positionsData.positions,
    positionsByProtocol: positionsData.positionsByProtocol,
  });

  const value = useMemo(
    () => ({ balances, positions, summary }),
    [balances, positions, summary],
  );

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
