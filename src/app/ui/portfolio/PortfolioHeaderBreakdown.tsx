'use client';

import { AssetOverviewCard } from '@/components/composite/AssetOverviewCard/AssetOverviewCard';
import { useFormatDisplayDeFiPositions } from '@/hooks/portfolio/useFormatDisplayDeFiPositions';
import { usePortfolioDeFiPositions } from '@/hooks/portfolio/usePortfolioDeFiPositions';
import { usePortfolioTracking } from '@/hooks/userTracking/usePortfolioTracking';
import { useConnectedEvmAddresses } from '@/hooks/useConnectedEvmAddresses';
import { useSettingsStore } from '@/stores/settings/SettingsStore';
import { useEffect, useMemo, useRef } from 'react';
import type { MinimalToken } from 'src/types/tokens';
import { usePortfolioDisplayTokens } from '@/hooks/portfolio/usePortfolioDisplayTokens';

export const PortfolioHeaderBreakdown = () => {
  const portfolioWelcomeScreenClosed = useSettingsStore(
    (state) => state.portfolioWelcomeScreenClosed,
  );
  const { trackPortfolioPageOverviewEvent } = usePortfolioTracking();
  const portfolioHasBeenTracked = useRef(false);
  const connectedAddresses = useConnectedEvmAddresses();
  const { data: allPositions, isLoading: isLoadingPositions } =
    usePortfolioDeFiPositions({
      addresses: connectedAddresses,
    });
  const { formattedData: formattedTokens, isFetching: isFetchingTokens } =
    usePortfolioDisplayTokens();

  const isLoading = isLoadingPositions || isFetchingTokens;

  const tokens = useMemo<MinimalToken[]>(() => {
    if (
      !formattedTokens ||
      formattedTokens.length === 0 ||
      !portfolioWelcomeScreenClosed ||
      isFetchingTokens
    ) {
      return [];
    }

    return formattedTokens;
  }, [isFetchingTokens, formattedTokens, portfolioWelcomeScreenClosed]);

  const formattedPositions = useFormatDisplayDeFiPositions(
    allPositions?.data,
    (position) => position.protocol.name,
  );

  const defiPositionGroups = useMemo(() => {
    if (
      formattedPositions.length === 0 ||
      !portfolioWelcomeScreenClosed ||
      isLoadingPositions
    ) {
      return [];
    }

    return formattedPositions;
  }, [isLoadingPositions, formattedPositions, portfolioWelcomeScreenClosed]);

  useEffect(() => {
    if (
      portfolioHasBeenTracked.current ||
      isLoading ||
      !portfolioWelcomeScreenClosed ||
      !connectedAddresses.length
    ) {
      return;
    }
    trackPortfolioPageOverviewEvent(
      connectedAddresses,
      tokens,
      defiPositionGroups,
    );
    portfolioHasBeenTracked.current = true;
  });

  return (
    <AssetOverviewCard
      tokens={tokens}
      defiPositionGroups={defiPositionGroups}
      isLoading={portfolioWelcomeScreenClosed && isLoading}
      showNoContent={portfolioWelcomeScreenClosed}
    />
  );
};
