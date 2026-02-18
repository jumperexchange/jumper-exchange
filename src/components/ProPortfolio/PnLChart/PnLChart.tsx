import type { PnLDataPoint } from '@/types/pro-portfolio';
import {
  LineChart,
  type LineChartProps,
} from '@/components/core/charts/LineChart/LineChart';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';

export interface PnLChartProps {
  data: PnLDataPoint[];
  isLoading?: boolean;
}

export const PnLChart = ({ data, isLoading }: PnLChartProps) => {
  const muiTheme = useTheme();

  const lastPoint = data[data.length - 1];
  const isPositive = lastPoint ? lastPoint.pnlUsd >= 0 : true;

  const chartTheme: LineChartProps['theme'] = useMemo(
    () => ({
      lineColor: isPositive
        ? (muiTheme.vars || muiTheme).palette.success.main
        : (muiTheme.vars || muiTheme).palette.error.main,
      areaTopColor: isPositive
        ? `color-mix(in srgb, ${(muiTheme.vars || muiTheme).palette.success.main} 20%, transparent)`
        : `color-mix(in srgb, ${(muiTheme.vars || muiTheme).palette.error.main} 20%, transparent)`,
      areaBottomColor: 'transparent',
      pointColor: isPositive
        ? (muiTheme.vars || muiTheme).palette.success.main
        : (muiTheme.vars || muiTheme).palette.error.main,
    }),
    [muiTheme, isPositive],
  );

  const chartData = useMemo(
    () => data.map((d) => ({ date: d.date, value: d.valueUsd })),
    [data],
  );

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: (muiTheme.vars || muiTheme).palette.surface2.main,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Typography variant="bodyMediumStrong" color="text.secondary">
        Portfolio Value Over Time
      </Typography>
      <Box sx={{ height: 320 }}>
        <LineChart
          data={chartData}
          theme={chartTheme}
          dateFormat="dd MMM yyyy"
          dataSetId="pnl"
          isLoading={isLoading}
          valueFormatConfig={{
            type: 'currency',
            options: { maximumFractionDigits: 2 },
          }}
        />
      </Box>
    </Box>
  );
};
