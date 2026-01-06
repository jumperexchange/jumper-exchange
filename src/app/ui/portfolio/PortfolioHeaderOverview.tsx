'use client';

import { useConnectedEvmAddresses } from '@/hooks/useConnectedEvmAddresses';
import { useTheme } from '@mui/material/styles';
import { sumBy } from 'lodash';
import { AnimatedCounter } from 'react-animated-counter';
import {
  PortfolioHeaderOverviewContainer,
  PortfolioHeaderOverviewContentContainer,
  PortfolioHeaderOverviewHeaderContainer,
  PortfolioHeaderOverviewValue,
} from './PortfolioPage.styles';
import PortfolioRefreshBalance from './PortfolioRefreshBalance';
import { usePortfolioDeFiPositions } from '@/hooks/portfolio/usePortfolioDeFiPositions';
import { useSettingsStore } from '@/stores/settings/SettingsStore';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { usePortfolioDisplayTokens } from '@/hooks/portfolio/usePortfolioDisplayTokens';

export const PortfolioHeaderOverview = () => {
  const portfolioWelcomeScreenClosed = useSettingsStore(
    (state) => state.portfolioWelcomeScreenClosed,
  );
  const { t } = useTranslation();
  const theme = useTheme();
  const connectedAddresses = useConnectedEvmAddresses();
  const {
    formattedData: formattedTokens,
    isFetching: isFetchingPortfolioDisplayTokens,
    refetch: refetchPortfolioDisplayTokens,
  } = usePortfolioDisplayTokens();
  const {
    data: allDeFiPositions,
    refetch: refetchPortfolioDeFiPositions,
    isLoading: isLoadingDeFiPositions,
  } = usePortfolioDeFiPositions({
    addresses: connectedAddresses,
  });

  const isLoading = isLoadingDeFiPositions || isFetchingPortfolioDisplayTokens;

  let totalValue = 0;

  if (portfolioWelcomeScreenClosed) {
    const totalFilteredTokensValue = sumBy(
      formattedTokens,
      (token) => token.totalPriceUSD ?? 0,
    );
    const totalDeFiPositionsValue = sumBy(
      allDeFiPositions?.data ?? [],
      (position) => position.netUsd ?? 0,
    );
    totalValue = totalFilteredTokensValue + totalDeFiPositionsValue;
  }

  const handleRefresh = () => {
    refetchPortfolioDisplayTokens();
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
