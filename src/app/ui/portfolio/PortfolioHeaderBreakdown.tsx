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

export const PortfolioHeaderBreakdown = () => {
  const portfolioWelcomeScreenClosed = useSettingsStore(
    (state) => state.portfolioWelcomeScreenClosed,
  );
  const { accounts } = useAccount();
  const connectedAddresses = useMemo(() => {
    return accounts
      .filter((account) => account.isConnected && !!account?.address)
      .map((account) => account.address as Hex);
  }, [accounts]);
  const { data: allPositions, isLoading: isLoadingPositions } =
    usePortfolioDeFiPositions({
      addresses: connectedAddresses,
    });
  const { data: allTokens, isFetching: isFetchingTokens } =
    usePortfolioTokens();

  const isLoading = isLoadingPositions || isFetchingTokens;

  const tokens = useMemo<MinimalToken[]>(() => {
    if (!allTokens || allTokens.length === 0 || !portfolioWelcomeScreenClosed) {
      return [];
    }

    return allTokens.map((token) => ({
      address: token.address,
      symbol: token.symbol,
      chain: {
        chainId: token.chainId,
        chainKey: 'chainName' in token ? (token.chainName ?? '') : '',
      },
      balance: token.cumulatedBalance ?? 0,
      totalPriceUSD: token.cumulatedTotalUSD ?? 0,
      relatedTokens: token.chains.map((chain) => ({
        address: chain.address,
        symbol: chain.symbol,
        chain: {
          chainId: chain.chainId,
          chainKey: chain.chainName ?? '',
        },
        balance: chain.cumulatedBalance ?? 0,
        totalPriceUSD: chain.totalPriceUSD ?? 0,
      })),
    }));
  }, [allTokens, portfolioWelcomeScreenClosed]);

  const positions = useFormatDisplayDeFiPositionsData(
    allPositions?.positions ?? [],
  );

  const defiPositions = useMemo<MinimalDeFiPosition[]>(() => {
    if (positions.length === 0 || !portfolioWelcomeScreenClosed) {
      return [];
    }

    return positions;
  }, [positions, portfolioWelcomeScreenClosed]);

  return (
    <AssetOverviewCard
      tokens={tokens}
      defiPositions={defiPositions}
      isLoading={portfolioWelcomeScreenClosed && isLoading}
    />
  );
};
