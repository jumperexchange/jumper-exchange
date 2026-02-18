import type { PerformanceMetrics } from '@/types/pro-portfolio';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

export interface PerformanceMetricsCardProps {
  metrics: PerformanceMetrics;
}

const MetricItem = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
    <Typography variant="bodyXSmall" color="text.secondary">
      {label}
    </Typography>
    <Typography
      variant="bodyMediumStrong"
      sx={{
        color: color ?? 'text.primary',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {value}
    </Typography>
  </Box>
);

export const PerformanceMetricsCard = ({
  metrics,
}: PerformanceMetricsCardProps) => {
  const theme = useTheme();
  const successColor = (theme.vars || theme).palette.success.main;
  const errorColor = (theme.vars || theme).palette.error.main;

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: (theme.vars || theme).palette.surface2.main,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="bodyMediumStrong" color="text.secondary">
        Performance Metrics
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 2.5,
        }}
      >
        <MetricItem
          label="Best Day"
          value={`+$${metrics.bestDay.pnlUsd.toLocaleString()} (${metrics.bestDay.pnlPercent.toFixed(1)}%)`}
          color={successColor}
        />
        <MetricItem
          label="Worst Day"
          value={`-$${Math.abs(metrics.worstDay.pnlUsd).toLocaleString()} (${metrics.worstDay.pnlPercent.toFixed(1)}%)`}
          color={errorColor}
        />
        <MetricItem
          label="Win Rate"
          value={`${metrics.winRate.toFixed(1)}%`}
          color={metrics.winRate >= 50 ? successColor : errorColor}
        />
        <MetricItem
          label="Max Drawdown"
          value={`${metrics.maxDrawdown.toFixed(1)}%`}
          color={errorColor}
        />
        {metrics.sharpeRatio !== undefined && (
          <MetricItem
            label="Sharpe Ratio"
            value={metrics.sharpeRatio.toFixed(2)}
            color={metrics.sharpeRatio >= 1 ? successColor : undefined}
          />
        )}
        {metrics.volatility !== undefined && (
          <MetricItem
            label="Volatility"
            value={`${metrics.volatility.toFixed(1)}%`}
          />
        )}
      </Box>
    </Box>
  );
};
