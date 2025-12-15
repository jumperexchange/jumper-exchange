'use client';

import { AssetOverviewCard } from '@/components/composite/AssetOverviewCard/AssetOverviewCard';
import { useFormatDisplayDeFiPositions } from '@/hooks/portfolio/useFormatDisplayDeFiPositions';
import { useFormatDisplayWalletTokens } from '@/hooks/portfolio/useFormatDisplayWalletTokens';
import { usePortfolioDeFiPositions } from '@/hooks/portfolio/usePortfolioDeFiPositions';
import { usePortfolioTracking } from '@/hooks/userTracking/usePortfolioTracking';
import { useSettingsStore } from '@/stores/settings/SettingsStore';
import { usePortfolioTokens } from '@/utils/getTokens/usePortfolioTokens';
import { ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import { useEffect, useMemo, useRef } from 'react';
import type { MinimalToken } from 'src/types/tokens';
import type { Hex } from 'viem';

export const PortfolioHeaderBreakdown = () => {
  const portfolioWelcomeScreenClosed = useSettingsStore(
    (state) => state.portfolioWelcomeScreenClosed,
  );
  const { trackPortfolioPageOverviewEvent } = usePortfolioTracking();
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

  const isLoading = isLoadingPositions || isFetchingTokens;

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
    allPositions?.data,
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
