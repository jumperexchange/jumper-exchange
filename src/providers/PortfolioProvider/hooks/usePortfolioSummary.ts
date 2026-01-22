'use client';

import { useMemo } from 'react';
import { processSummary } from '../utils/processSummary';
import type { PortfolioTokenGroup } from '../types/PortfolioTokenGroup';
import type { PortfolioDeFiPositionsGroup } from '../types/PortfolioDeFiPositionsGroup';
import type { PortfolioSummary } from '../types/PortfolioSummary';

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
