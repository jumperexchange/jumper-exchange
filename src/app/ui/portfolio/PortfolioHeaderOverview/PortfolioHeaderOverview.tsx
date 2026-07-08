'use client';

import { useTheme } from '@mui/material/styles';
import { AnimatedCounter } from 'react-animated-counter';
import {
  PortfolioHeaderOverviewContainer,
  PortfolioHeaderOverviewContentContainer,
  PortfolioHeaderOverviewHeaderContainer,
  PortfolioHeaderOverviewValue,
} from './PortfolioHeaderOverview.styles';
import PortfolioRefreshBalance from './PortfolioRefreshBalance';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { usePortfolioWelcomeScreen } from '@/hooks/usePortfolioWelcomeScreen';
import { useMemo } from 'react';
import { getPortfolioValueInDollarParts } from '@/utils/numbers/portfolioValueInDollar';
import { usePortfolioSummary } from '@/providers/PortfolioProvider/PortfolioContext';
import { AB_TEST_NAME } from '@/const/abtests';
import { useABTest } from '@/hooks/useABTest';
import { PortfolioHeaderOverviewPnLSection } from './PortfolioHeaderOverviewPnLSection';
import { PortfolioPnlChartDisclaimer } from './PortfolioPnlChartDisclaimer';

export const PortfolioHeaderOverview = () => {
  const { portfolioWelcomeScreenClosed } = usePortfolioWelcomeScreen();
  const { t } = useTranslation();
  const theme = useTheme();
  const pnlChartFlag = useABTest({ feature: AB_TEST_NAME.PORTFOLIO_PNL_CHART });
  const showPnlChart =
    pnlChartFlag.isEnabled &&
    (pnlChartFlag.value === true || pnlChartFlag.value === 'test');

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
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Typography
            variant="bodyMediumStrong"
            sx={{
              color: 'text.secondary',
            }}
          >
            {t('portfolio.overviewCard.title')}
          </Typography>
          {showPnlChart && <PortfolioPnlChartDisclaimer />}
        </Stack>
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
        {showPnlChart && <PortfolioHeaderOverviewPnLSection />}
      </PortfolioHeaderOverviewContentContainer>
    </PortfolioHeaderOverviewContainer>
  );
};
