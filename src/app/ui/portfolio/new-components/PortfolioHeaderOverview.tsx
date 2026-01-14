'use client';

import { useTheme } from '@mui/material/styles';
import { AnimatedCounter } from 'react-animated-counter';
import {
  PortfolioHeaderOverviewContainer,
  PortfolioHeaderOverviewContentContainer,
  PortfolioHeaderOverviewHeaderContainer,
  PortfolioHeaderOverviewValue,
} from '../PortfolioPage.styles';
import PortfolioRefreshBalance from '../PortfolioRefreshBalance';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { usePortfolioWelcomeScreen } from '@/hooks/usePortfolioWelcomeScreen';
import { useMemo } from 'react';
import { getPortfolioValueInDollarParts } from '@/utils/numbers/portfolioValueInDollar';
import {
  usePortfolioSummary,
  usePortfolioState,
  usePortfolioTokens,
  usePortfolioPositions,
} from '@/providers/PortfolioProvider/PortfolioContext';

export const PortfolioHeaderOverview = () => {
  const { portfolioWelcomeScreenClosed } = usePortfolioWelcomeScreen();
  const { t } = useTranslation();
  const theme = useTheme();

  const summary = usePortfolioSummary();
  const { isLoading, refetchAll } = usePortfolioState();
  const { updatedAt: tokensUpdatedAt } = usePortfolioTokens();
  const { updatedAt: positionsUpdatedAt } = usePortfolioPositions();

  const totalValue = useMemo(() => {
    if (!portfolioWelcomeScreenClosed) {
      return 0;
    }
    return summary.totalValueUSD;
  }, [portfolioWelcomeScreenClosed, summary.totalValueUSD]);

  const { prefix, suffix, numericValue } =
    getPortfolioValueInDollarParts(totalValue);

  const handleRefresh = () => {
    refetchAll();
  };

  const updatedAt = Math.max(tokensUpdatedAt ?? 0, positionsUpdatedAt ?? 0);

  return (
    <PortfolioHeaderOverviewContainer>
      <PortfolioHeaderOverviewHeaderContainer>
        <Typography variant="bodyMediumStrong" color="text.secondary">
          {t('portfolio.overviewCard.title')}
        </Typography>
        {portfolioWelcomeScreenClosed && (
          <PortfolioRefreshBalance
            updatedAt={updatedAt}
            timeToUpdate={0}
            onClick={handleRefresh}
            isLoading={isLoading && portfolioWelcomeScreenClosed}
          />
        )}
      </PortfolioHeaderOverviewHeaderContainer>
      <PortfolioHeaderOverviewContentContainer>
        <PortfolioHeaderOverviewValue as="div">
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
