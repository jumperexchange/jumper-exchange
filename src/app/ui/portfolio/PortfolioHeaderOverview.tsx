'use client';

import { useTheme } from '@mui/material/styles';
import { AnimatedCounter } from 'react-animated-counter';
import {
  PortfolioHeaderOverviewContainer,
  PortfolioHeaderOverviewContentContainer,
  PortfolioHeaderOverviewHeaderContainer,
  PortfolioHeaderOverviewValue,
} from './PortfolioPage.styles';
import PortfolioRefreshBalance from './PortfolioRefreshBalance';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import { usePortfolioWelcomeScreen } from '@/hooks/usePortfolioWelcomeScreen';
import { useMemo } from 'react';
import { getPortfolioValueInDollarParts } from '@/utils/numbers/portfolioValueInDollar';
import { usePortfolioSummary } from '@/providers/PortfolioProvider/PortfolioContext';

export const PortfolioHeaderOverview = () => {
  const { portfolioWelcomeScreenClosed } = usePortfolioWelcomeScreen();
  const { t } = useTranslation();
  const theme = useTheme();

  const summary = usePortfolioSummary();

  const totalValue = useMemo(() => {
    if (!portfolioWelcomeScreenClosed) {
      return 0;
    }
    return summary.totalPortfolioUsd;
  }, [portfolioWelcomeScreenClosed, summary.totalPortfolioUsd]);

  const { prefix, suffix, numericValue } =
    getPortfolioValueInDollarParts(totalValue);

  return (
    <PortfolioHeaderOverviewContainer>
      <PortfolioHeaderOverviewHeaderContainer>
        <Typography
          variant="bodyMediumStrong"
          sx={{
            color: 'text.secondary',
          }}
        >
          {t('portfolio.overviewCard.title')}
        </Typography>
        {portfolioWelcomeScreenClosed && <PortfolioRefreshBalance />}
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
