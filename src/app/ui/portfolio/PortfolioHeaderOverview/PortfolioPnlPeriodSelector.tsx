import type { BalanceHistoryPeriod } from '@/hooks/portfolio/usePortfolioBalanceHistory';
import { PERIODS, PERIOD_LABELS } from './constants';
import {
  PortfolioChartButtonsContainer,
  PortfolioChartButton,
} from './PortfolioHeaderOverview.styles';
import { usePortfolioPnl } from '@/providers/PortfolioProvider/PortfolioContext';
import { type FC } from 'react';

interface PortfolioPnlPeriodSelectorProps {}

export const PortfolioPnlPeriodSelector: FC<
  PortfolioPnlPeriodSelectorProps
> = () => {
  const { period, setPeriod } = usePortfolioPnl();
  return (
    <PortfolioChartButtonsContainer direction="row">
      {PERIODS.map((p) => (
        <PortfolioChartButton
          key={p}
          isActive={p === period}
          onClick={() => setPeriod(p)}
          size="small"
        >
          {PERIOD_LABELS[p]}
        </PortfolioChartButton>
      ))}
    </PortfolioChartButtonsContainer>
  );
};
