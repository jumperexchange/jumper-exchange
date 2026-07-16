'use client';

import { LineChart } from '@/components/core/charts/LineChart/LineChart';
import {
  usePortfolioPnl,
  usePortfolioState,
} from '@/providers/PortfolioProvider/PortfolioContext';
import { TVL_FORMAT_CONFIG } from '@/utils/numbers/tvl';
import { Stack } from '@mui/material';
import { usePortfolioChartTheme } from './hooks';
import { PortfolioChartContainer } from './PortfolioHeaderOverview.styles';
import { PortfolioPnlDisplay } from './PortfolioPnlDisplay';
import { PortfolioPnlPeriodSelector } from './PortfolioPnlPeriodSelector';

export const PortfolioHeaderOverviewPnLSection = () => {
  const { pnlValue, pnlPercentage, pnlChart } = usePortfolioPnl();
  const {
    sources: { pnlChart: pnlChartSource },
  } = usePortfolioState();
  const chartTheme = usePortfolioChartTheme();

  const showPnlChart = !pnlChartSource.isEmpty || pnlChartSource.isLoading;
  const showPnlValue = showPnlChart;

  if (!showPnlValue && !showPnlChart) {
    return null;
  }

  return (
    <Stack sx={{ gap: 0, width: '100%' }}>
      <Stack
        sx={{
          gap: {
            xs: 1,
            sm: 0,
          },
          alignItems: {
            sm: 'center',
          },
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
        }}
      >
        {showPnlValue ? (
          <PortfolioPnlDisplay
            isLoading={pnlChartSource.isLoading || pnlChartSource.isRefreshing}
            pnlValue={pnlValue}
            pnlPercentage={pnlPercentage}
          />
        ) : null}
        <PortfolioPnlPeriodSelector />
      </Stack>
      {showPnlChart ? (
        <PortfolioChartContainer>
          <LineChart
            isLoading={pnlChartSource.isLoading || pnlChartSource.isRefreshing}
            data={pnlChart}
            theme={chartTheme}
            valueFormatConfig={TVL_FORMAT_CONFIG}
            enableXAxis={false}
            enableYAxis={false}
            enableGridY={false}
          />
        </PortfolioChartContainer>
      ) : null}
    </Stack>
  );
};
