'use client';

import { AssetOverviewCard } from '@/components/composite/AssetOverviewCard/AssetOverviewCard';
import { useFormatDisplayDeFiPositions } from '@/hooks/portfolio/useFormatDisplayDeFiPositions';
import { useFormatDisplayWalletTokens } from '@/hooks/portfolio/useFormatDisplayWalletTokens';
import { usePortfolioDeFiPositions } from '@/hooks/portfolio/usePortfolioDeFiPositions';
import { useTokensWithoutLpPositions } from '@/hooks/portfolio/useTokensWithoutLpPositions';
import { usePortfolioTracking } from '@/hooks/userTracking/usePortfolioTracking';
import { useConnectedEvmAddresses } from '@/hooks/useConnectedEvmAddresses';
import { useSettingsStore } from '@/stores/settings/SettingsStore';
import { usePortfolioTokens } from '@/utils/getTokens/usePortfolioTokens';
import { useEffect, useMemo, useRef } from 'react';
import type { MinimalToken } from 'src/types/tokens';
import { usePortfolioWelcomeScreen } from '@/hooks/usePortfolioWelcomeScreen';

export const PortfolioHeaderBreakdown = () => {
  const { portfolioWelcomeScreenClosed } = usePortfolioWelcomeScreen();
  const { trackPortfolioPageOverviewEvent } = usePortfolioTracking();
  const portfolioHasBeenTracked = useRef(false);
  const connectedAddresses = useConnectedEvmAddresses();
  const { data: allPositions, isLoading: isLoadingPositions } =
    usePortfolioDeFiPositions({
      addresses: connectedAddresses,
    });
  const { data: allTokens, isFetching: isFetchingTokens } =
    usePortfolioTokens();

  const isLoading = isLoadingPositions || isFetchingTokens;

  const formattedTokens = useFormatDisplayWalletTokens(allTokens);
  const filteredTokens = useTokensWithoutLpPositions(formattedTokens);

  const tokens = useMemo<MinimalToken[]>(() => {
    if (
      !filteredTokens ||
      filteredTokens.length === 0 ||
      !portfolioWelcomeScreenClosed ||
      isFetchingTokens
    ) {
      return [];
    }

    return filteredTokens;
  }, [isFetchingTokens, filteredTokens, portfolioWelcomeScreenClosed]);

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
