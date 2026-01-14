'use client';

import { AssetOverviewCard } from './AssetOverviewCard/AssetOverviewCard';
import { useFormatDisplayDeFiPositions } from '@/hooks/portfolio/useFormatDisplayDeFiPositions';
import { usePortfolioTracking } from '@/hooks/userTracking/usePortfolioTracking';
import { useConnectedEvmAddresses } from '@/hooks/useConnectedEvmAddresses';
import { useEffect, useMemo, useRef } from 'react';
import { usePortfolioWelcomeScreen } from '@/hooks/usePortfolioWelcomeScreen';
import {
  usePortfolioTokens,
  usePortfolioPositions,
  usePortfolioSummary,
  usePortfolioState,
} from '@/providers/PortfolioProvider/PortfolioContext';

export const PortfolioHeaderBreakdown = () => {
  const { portfolioWelcomeScreenClosed } = usePortfolioWelcomeScreen();
  const { trackPortfolioPageOverviewEvent } = usePortfolioTracking();
  const portfolioHasBeenTracked = useRef(false);
  const connectedAddresses = useConnectedEvmAddresses();

  const summary = usePortfolioSummary();
  const { isLoading } = usePortfolioState();

  useEffect(() => {
    if (
      portfolioHasBeenTracked.current ||
      isLoading ||
      !portfolioWelcomeScreenClosed ||
      !connectedAddresses.length
    ) {
      return;
    }
    // trackPortfolioPageOverviewEvent(
    //   connectedAddresses,
    //   tokens,
    //   defiPositionGroups,
    // );
    portfolioHasBeenTracked.current = true;
  });

  return (
    <AssetOverviewCard
      tokens={summary.tokensBySymbol}
      tokensTotalValueUSD={summary.tokensValueUSD}
      positions={summary.positionsByProtocol}
      positionsTotalValueUSD={summary.positionsValueUSD}
      isLoading={portfolioWelcomeScreenClosed && isLoading}
      showNoContent={portfolioWelcomeScreenClosed}
    />
  );
};
