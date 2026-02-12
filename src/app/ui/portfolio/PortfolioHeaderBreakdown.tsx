'use client';

import { AssetOverviewCard } from '@/components/composite/AssetOverviewCard/AssetOverviewCard';
import { useConnectedEvmAddresses } from '@/hooks/useConnectedEvmAddresses';
import { usePortfolioWelcomeScreen } from '@/hooks/usePortfolioWelcomeScreen';
import { usePortfolioTracking } from '@/hooks/userTracking/usePortfolioTracking';
import {
  usePortfolioSummary,
  usePortfolioState,
} from '@/providers/PortfolioProvider/PortfolioContext';
import { useEffect, useRef } from 'react';

export const PortfolioHeaderBreakdown = () => {
  const connectedAddresses = useConnectedEvmAddresses();
  const { portfolioWelcomeScreenClosed } = usePortfolioWelcomeScreen();
  const { trackPortfolioPageOverviewEvent } = usePortfolioTracking();
  const portfolioHasBeenTracked = useRef(false);

  const summary = usePortfolioSummary();
  const state = usePortfolioState();

  const isLoading = state.isInitialLoading || state.isRefreshing;

  useEffect(() => {
    if (
      portfolioHasBeenTracked.current ||
      isLoading ||
      !portfolioWelcomeScreenClosed ||
      !connectedAddresses.length
    ) {
      return;
    }
    trackPortfolioPageOverviewEvent(connectedAddresses, summary);
    portfolioHasBeenTracked.current = true;
  });

  return (
    <AssetOverviewCard
      summaryData={summary}
      isLoading={portfolioWelcomeScreenClosed && isLoading}
      showNoContent={portfolioWelcomeScreenClosed}
    />
  );
};
