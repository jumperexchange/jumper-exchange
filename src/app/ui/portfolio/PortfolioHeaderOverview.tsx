'use client';

import { usePortfolioStore } from '@/stores/portfolio/PortfolioStore';
import { useAccount } from '@lifi/wallet-management';
import { useTheme } from '@mui/material/styles';
import { AnimatedCounter } from 'react-animated-counter';
import {
  PortfolioHeaderOverviewContainer,
  PortfolioHeaderOverviewContentContainer,
  PortfolioHeaderOverviewHeaderContainer,
  PortfolioHeaderOverviewValue,
} from './PortfolioPage.styles';
import PortfolioRefreshBalance from './PortfolioRefreshBalance';
import { usePortfolioTokens } from '@/utils/getTokens/usePortfolioTokens';
import { usePortfolioDeFiPositions } from '@/hooks/portfolio/usePortfolioDeFiPositions';
import type { Hex } from 'viem';
import { useSettingsStore } from '@/stores/settings/SettingsStore';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { ChainType } from '@lifi/widget';

export const PortfolioHeaderOverview = () => {
  const portfolioWelcomeScreenClosed = useSettingsStore(
    (state) => state.portfolioWelcomeScreenClosed,
  );
  const { t } = useTranslation();
  const theme = useTheme();
  const { accounts } = useAccount();
  const {
    refetch: refetchPortfolioTokens,
    isFetching: isFetchingPortfolioTokens,
  } = usePortfolioTokens();
  const { totalValue: totalValuePortfolioTokens } = usePortfolioStore((state) =>
    state.getFormattedCacheTokens(accounts ?? []),
  );
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
  const {
    data: allDeFiPositions,
    refetch: refetchPortfolioDeFiPositions,
    isLoading: isLoadingDeFiPositions,
  } = usePortfolioDeFiPositions({
    addresses: connectedAddresses,
  });

  const isLoading = isLoadingDeFiPositions || isFetchingPortfolioTokens;

  const totalValue = useMemo(() => {
    if (!portfolioWelcomeScreenClosed) {
      return 0;
    }
    const totalDeFiPositionsValue =
      allDeFiPositions?.positions?.reduce(
        (acc, position) => acc + (position.netUsd ?? 0),
        0,
      ) ?? 0;
    return totalValuePortfolioTokens + totalDeFiPositionsValue;
  }, [
    portfolioWelcomeScreenClosed,
    totalValuePortfolioTokens,
    allDeFiPositions,
  ]);

  const handleRefresh = () => {
    refetchPortfolioTokens();
    refetchPortfolioDeFiPositions();
  };

  return (
    <PortfolioHeaderOverviewContainer>
      <PortfolioHeaderOverviewHeaderContainer>
        <Typography variant="bodyMediumStrong" color="text.secondary">
          {t('portfolio.overviewCard.title')}
        </Typography>
        {portfolioWelcomeScreenClosed && (
          <PortfolioRefreshBalance
            updatedAt={0}
            timeToUpdate={0}
            onClick={handleRefresh}
            isLoading={isLoading && portfolioWelcomeScreenClosed}
          />
        )}
      </PortfolioHeaderOverviewHeaderContainer>
      <PortfolioHeaderOverviewContentContainer>
        <PortfolioHeaderOverviewValue as="div">
          <>
            $
            <AnimatedCounter
              value={totalValue}
              includeDecimals
              decimalPrecision={2}
              includeCommas
              incrementColor={(theme.vars || theme).palette.text.primary}
              decrementColor={(theme.vars || theme).palette.text.primary}
              color={(theme.vars || theme).palette.text.primary}
              containerStyles={{
                display: 'inline-flex',
                textAlign: 'center',
              }}
              digitStyles={{
                textOverflow: 'inherit',
                fontWeight: 'inherit',
                fontSize: 'inherit',
                lineHeight: 'inherit',
              }}
            />
          </>
        </PortfolioHeaderOverviewValue>
      </PortfolioHeaderOverviewContentContainer>
    </PortfolioHeaderOverviewContainer>
  );
};
