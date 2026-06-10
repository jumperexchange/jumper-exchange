'use client';

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
import { LineChart } from '@/components/core/charts/LineChart/LineChart';

export const PortfolioHeaderOverviewPnLSection = () => {
  const { period, setPeriod, pnlValue, pnlPercentage, chartData } =
    usePortfolioPnl();
  const {
    sources: { pnl: pnlSource },
  } = usePortfolioState();
  const chartTheme = usePortfolioChartTheme();

  return (
    <Stack sx={{ gap: 0, width: '100%' }}>
      <Stack
        sx={{
          gap: {
            xs: 1,
            sm: 0,
          },
          justifyContent: {
            sm: 'space-between',
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
        <PortfolioPnlDisplay
          isLoading={pnlSource.isLoading || pnlSource.isRefreshing}
          pnlValue={pnlValue}
          pnlPercentage={pnlPercentage}
        />
        <PortfolioPnlPeriodSelector
          period={period}
          onPeriodChange={setPeriod}
        />
      </Stack>
      <PortfolioChartContainer>
        <LineChart
          isLoading={pnlSource.isLoading || pnlSource.isRefreshing}
          data={chartData}
          theme={chartTheme}
          valueFormatConfig={TVL_FORMAT_CONFIG}
          enableXAxis={false}
          enableYAxis={false}
          enableGridY={false}
        />
      </PortfolioChartContainer>
    </Stack>
  );
};
