import type { BalanceHistoryPeriod } from '@/hooks/portfolio/usePortfolioBalanceHistory';
import { PERIODS, PERIOD_LABELS } from './constants';
import {
  PortfolioChartButtonsContainer,
  PortfolioChartButton,
} from './PortfolioHeaderOverview.styles';

interface PortfolioPnlPeriodSelectorProps {
  period: BalanceHistoryPeriod;
  onPeriodChange: (period: BalanceHistoryPeriod) => void;
}

export const PortfolioPnlPeriodSelector = ({
  period,
  onPeriodChange,
}: PortfolioPnlPeriodSelectorProps) => (
  <PortfolioChartButtonsContainer direction="row">
    {PERIODS.map((p) => (
      <PortfolioChartButton
        key={p}
        isActive={p === period}
        onClick={() => onPeriodChange(p)}
        size="small"
      >
        {PERIOD_LABELS[p]}
      </PortfolioChartButton>
    ))}
  </PortfolioChartButtonsContainer>
);
