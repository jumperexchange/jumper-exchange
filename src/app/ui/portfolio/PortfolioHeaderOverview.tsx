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
import { usePortfolioWelcomeScreen } from '@/hooks/usePortfolioWelcomeScreen';
import { usePortfolioDisplayTokens } from '@/hooks/portfolio/usePortfolioDisplayTokens';
import { useMemo } from 'react';
import { getNumberParts } from '@/utils/numbers/getNumberParts';
import { getPortfolioValueInDollarParts } from '@/utils/numbers/portfolioValueInDollar';

export const PortfolioHeaderOverview = () => {
  const { portfolioWelcomeScreenClosed } = usePortfolioWelcomeScreen();
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

  const totalValue = useMemo(() => {
    if (!portfolioWelcomeScreenClosed) {
      return 0;
    }
    const totalFilteredTokensValue = sumBy(
      formattedTokens,
      (token) => token.totalPriceUSD ?? 0,
    );
    const totalDeFiPositionsValue = sumBy(
      allDeFiPositions?.data ?? [],
      (position) => position.netUsd ?? 0,
    );

    return totalFilteredTokensValue + totalDeFiPositionsValue;
  }, [portfolioWelcomeScreenClosed, formattedTokens, allDeFiPositions?.data]);

  const { prefix, suffix, numericValue } =
    getPortfolioValueInDollarParts(totalValue);

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
        <PortfolioHeaderOverviewValue
          as="div"
          data-testid="portfolio-header-overview-value"
          aria-label={`Total value: ${totalValue}`}
        >
          <>
            {prefix}
            <AnimatedCounter
              value={Number(numericValue)}
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
            {suffix}
          </>
        </PortfolioHeaderOverviewValue>
      </PortfolioHeaderOverviewContentContainer>
    </PortfolioHeaderOverviewContainer>
  );
};
