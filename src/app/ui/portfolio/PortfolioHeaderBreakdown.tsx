'use client';

import { AssetOverviewCard } from '@/components/composite/AssetOverviewCard/AssetOverviewCard';
import { TrackingCategory, TrackingAction } from '@/const/trackingKeys';
import { useFormatDisplayDeFiPositions } from '@/hooks/portfolio/useFormatDisplayDeFiPositions';
import { useFormatDisplayWalletTokens } from '@/hooks/portfolio/useFormatDisplayWalletTokens';
import { usePortfolioDeFiPositions } from '@/hooks/portfolio/usePortfolioDeFiPositions';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useSettingsStore } from '@/stores/settings/SettingsStore';
import { usePortfolioTokens } from '@/utils/getTokens/usePortfolioTokens';
import { parseEarnPortfolioDataToTrackingData } from '@/utils/tracking/portfolio';
import { ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import { useEffect, useMemo, useRef } from 'react';
import type { MinimalToken } from 'src/types/tokens';
import type { Hex } from 'viem';

export const PortfolioHeaderBreakdown = () => {
  const portfolioWelcomeScreenClosed = useSettingsStore(
    (state) => state.portfolioWelcomeScreenClosed,
  );
  const { trackEvent } = useUserTracking();
  const portfolioHasBeenTracked = useRef(false);
  const { accounts } = useAccount();
  const connectedAddresses = useMemo(() => {
    return accounts
      .filter(
        (account) =>
          account.isConnected &&
          !!account?.address &&
          account.chainType === ChainType.EVM,
      )
      .map((account) => account.address as Hex);
  }, [accounts]);
  const { data: allPositions, isLoading: isLoadingPositions } =
    usePortfolioDeFiPositions({
      addresses: connectedAddresses,
    });
  const { data: allTokens, isFetching: isFetchingTokens } =
    usePortfolioTokens();

  const isLoading = useMemo(() => {
    return isLoadingPositions || isFetchingTokens;
  }, [isLoadingPositions, isFetchingTokens]);

  const formattedTokens = useFormatDisplayWalletTokens(allTokens);

  const tokens = useMemo<MinimalToken[]>(() => {
    if (
      !formattedTokens ||
      formattedTokens.length === 0 ||
      !portfolioWelcomeScreenClosed
    ) {
      return [];
    }

    return formattedTokens;
  }, [formattedTokens, portfolioWelcomeScreenClosed]);

  const formattedPositions = useFormatDisplayDeFiPositions(
    allPositions?.positions,
    (position) => position.protocol.name,
  );

  const defiPositionGroups = useMemo(() => {
    if (formattedPositions.length === 0 || !portfolioWelcomeScreenClosed) {
      return [];
    }

    return formattedPositions;
  }, [formattedPositions, portfolioWelcomeScreenClosed]);

  useEffect(() => {
    if (
      isLoading ||
      portfolioHasBeenTracked.current ||
      !portfolioWelcomeScreenClosed
    ) {
      return;
    }
    portfolioHasBeenTracked.current = true;
    const trackingData = parseEarnPortfolioDataToTrackingData(
      connectedAddresses,
      tokens,
      defiPositionGroups,
    );
    trackEvent({
      category: TrackingCategory.Portfolio,
      action: TrackingAction.PortfolioPageOverview,
      label: 'portfolio_page_overview',
      data: trackingData,
    });
  }, [
    trackEvent,
    portfolioWelcomeScreenClosed,
    isLoading,
    tokens,
    defiPositionGroups,
    connectedAddresses,
  ]);

  return (
    <AssetOverviewCard
      tokens={tokens}
      defiPositionGroups={defiPositionGroups}
      isLoading={portfolioWelcomeScreenClosed && isLoading}
      showNoContent={portfolioWelcomeScreenClosed}
    />
  );
};
