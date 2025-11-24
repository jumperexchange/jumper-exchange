'use client';

import { AssetOverviewCard } from '@/components/composite/AssetOverviewCard/AssetOverviewCard';
import { usePortfolioDeFiPositions } from '@/hooks/portfolio/usePortfolioDeFiPositions';
import { usePortfolioTokens } from '@/utils/getTokens/usePortfolioTokens';
import { useAccount } from '@lifi/wallet-management';
import type { Hex } from 'viem';
import { useMemo } from 'react';
import type { MinimalToken } from 'src/types/tokens';
import type { MinimalDeFiPosition } from 'src/types/defi';
import { useSettingsStore } from '@/stores/settings/SettingsStore';
import { useFormatDisplayDeFiPositionsData } from '@/hooks/portfolio/useFormatDisplayDeFiPositionsData';
import { useFormatDisplayWalletTokens } from '@/hooks/portfolio/useFormatDisplayWalletTokens';
import { ChainType } from '@lifi/sdk';

export const PortfolioHeaderBreakdown = () => {
  const portfolioWelcomeScreenClosed = useSettingsStore(
    (state) => state.portfolioWelcomeScreenClosed,
  );
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

  const formattedPositions = useFormatDisplayDeFiPositionsData(
    allPositions?.positions ?? [],
  );

  const defiPositions = useMemo<MinimalDeFiPosition[]>(() => {
    if (formattedPositions.length === 0 || !portfolioWelcomeScreenClosed) {
      return [];
    }

    return formattedPositions;
  }, [formattedPositions, portfolioWelcomeScreenClosed]);

  return (
    <AssetOverviewCard
      tokens={tokens}
      defiPositions={defiPositions}
      isLoading={portfolioWelcomeScreenClosed && isLoading}
    />
  );
};
