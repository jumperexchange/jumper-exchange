'use client';

import { AssetOverviewCard } from '../composite/AssetOverviewCard/AssetOverviewCard';
import { usePortfolioWelcomeScreen } from '@/hooks/usePortfolioWelcomeScreen';
import { usePortfolioSummary, usePortfolioState } from '../../PortfolioContext';

export const PortfolioHeaderBreakdown = () => {
  const { portfolioWelcomeScreenClosed } = usePortfolioWelcomeScreen();

  const summary = usePortfolioSummary();
  const state = usePortfolioState();

  const isLoading = state.isInitialLoading;

  return (
    <AssetOverviewCard
      summaryData={summary}
      isLoading={portfolioWelcomeScreenClosed && isLoading}
      showNoContent={portfolioWelcomeScreenClosed}
    />
  );
};
