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
import { useOrchestrationState } from './hooks/useOrchestrationState';
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
    }),
    [
      balancesData.balances,
      balancesData.balancesByAddress,
      balancesData.metadata,
    ],
  );

  const positions: PositionsState = useMemo(
    () => ({
      positions: positionsData.positions,
      positionsByAddress: positionsData.positionsByAddress,
      positionsByProtocolAndChain: positionsData.positionsByProtocolAndChain,
      positionsByProtocol: positionsData.positionsByProtocol,
      metadata: positionsData.metadata,
      lpTokens: positionsData.lpTokens,
    }),
    [
      positionsData.positions,
      positionsData.positionsByAddress,
      positionsData.positionsByProtocolAndChain,
      positionsData.positionsByProtocol,
      positionsData.metadata,
      positionsData.lpTokens,
    ],
  );

  const summary = usePortfolioSummaryData({
    balances: balancesData.balances,
    positions: positionsData.positions,
    positionsByProtocol: positionsData.positionsByProtocol,
  });

  const state = useOrchestrationState(balancesData, positionsData);

  const value = useMemo(
    () => ({ balances, positions, summary, state }),
    [balances, positions, summary, state],
  );

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
