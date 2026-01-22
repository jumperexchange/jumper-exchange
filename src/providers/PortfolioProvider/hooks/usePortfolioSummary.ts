'use client';

import { useMemo } from 'react';
import { processSummary } from '../utils/summary';
import type { PortfolioTokenGroup } from '../types/tokens';
import type { PortfolioDeFiPositionsGroup } from '../types/positions';
import type { PortfolioSummary } from '../types/summary';

export interface UsePortfolioSummaryParams {
  tokensBySymbol: PortfolioTokenGroup[];
  positionsByProtocol: PortfolioDeFiPositionsGroup[];
}

export const usePortfolioSummary = ({
  tokensBySymbol,
  positionsByProtocol,
}: UsePortfolioSummaryParams): PortfolioSummary => {
  return useMemo(
    () => processSummary(tokensBySymbol, positionsByProtocol),
    [tokensBySymbol, positionsByProtocol],
  );
};
