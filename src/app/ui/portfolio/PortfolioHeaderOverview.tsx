'use client';

import { useConnectedEvmAddresses } from '@/hooks/useConnectedEvmAddresses';
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
import { useFormatDisplayWalletTokens } from '@/hooks/portfolio/useFormatDisplayWalletTokens';
import { usePortfolioDeFiPositions } from '@/hooks/portfolio/usePortfolioDeFiPositions';
import { useTokensWithoutLpPositions } from '@/hooks/portfolio/useTokensWithoutLpPositions';
import { useSettingsStore } from '@/stores/settings/SettingsStore';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';

export const PortfolioHeaderOverview = () => {
  const portfolioWelcomeScreenClosed = useSettingsStore(
    (state) => state.portfolioWelcomeScreenClosed,
  );
  const { t } = useTranslation();
  const theme = useTheme();
  const connectedAddresses = useConnectedEvmAddresses();
  const {
    data: allTokens,
    refetch: refetchPortfolioTokens,
    isFetching: isFetchingPortfolioTokens,
  } = usePortfolioTokens();
  const formattedTokens = useFormatDisplayWalletTokens(allTokens);
  const {
    data: allDeFiPositions,
    refetch: refetchPortfolioDeFiPositions,
    isLoading: isLoadingDeFiPositions,
  } = usePortfolioDeFiPositions({
    addresses: connectedAddresses,
  });

  const filteredTokens = useTokensWithoutLpPositions(formattedTokens);

  const isLoading = isLoadingDeFiPositions || isFetchingPortfolioTokens;

  const totalValue = useMemo(() => {
    if (!portfolioWelcomeScreenClosed) {
      return 0;
    }
    const totalFilteredTokensValue = filteredTokens.reduce(
      (acc, token) => acc + (token.totalPriceUSD ?? 0),
      0,
    );
    const totalDeFiPositionsValue =
      allDeFiPositions?.data?.reduce(
        (acc, position) => acc + (position.netUsd ?? 0),
        0,
      ) ?? 0;
    return totalFilteredTokensValue + totalDeFiPositionsValue;
  }, [
    portfolioWelcomeScreenClosed,
    filteredTokens,
    allDeFiPositions?.positions,
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
              fontSize={theme.typography.title2XLarge.fontSize?.toString()}
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
              }}
            />
          </>
        </PortfolioHeaderOverviewValue>
      </PortfolioHeaderOverviewContentContainer>
    </PortfolioHeaderOverviewContainer>
  );
};
