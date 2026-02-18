import type { PnLTimeframeSummary } from '@/types/pro-portfolio';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export interface PnLSummaryCardProps {
  summary: PnLTimeframeSummary;
}

function formatUsd(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (abs >= 1_000) {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${value.toFixed(2)}`;
}

export const PnLSummaryCard = ({ summary }: PnLSummaryCardProps) => {
  const theme = useTheme();
  const isPositive = summary.totalPnlUsd >= 0;
  const pnlColor = isPositive
    ? (theme.vars || theme).palette.success.main
    : (theme.vars || theme).palette.error.main;

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
        Portfolio Value
      </Typography>

      <Typography
        variant="title2XLarge"
        sx={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {formatUsd(summary.currentValueUsd)}
      </Typography>

      {/* PNL badge */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.25,
            borderRadius: 1,
            bgcolor: `color-mix(in srgb, ${pnlColor} 12%, transparent)`,
          }}
        >
          {isPositive ? (
            <ArrowUpwardIcon sx={{ fontSize: 14, color: pnlColor }} />
          ) : (
            <ArrowDownwardIcon sx={{ fontSize: 14, color: pnlColor }} />
          )}
          <Typography
            variant="bodySmallStrong"
            sx={{ color: pnlColor, fontVariantNumeric: 'tabular-nums' }}
          >
            {isPositive ? '+' : ''}
            {summary.totalPnlPercent.toFixed(2)}%
          </Typography>
        </Box>
        <Typography
          variant="bodySmall"
          sx={{ color: pnlColor, fontVariantNumeric: 'tabular-nums' }}
        >
          {isPositive ? '+' : ''}
          {formatUsd(summary.totalPnlUsd)}
        </Typography>
      </Box>

      {/* Realized / Unrealized breakdown */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 2,
          pt: 1,
          borderTop: `1px solid`,
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography variant="bodyXSmall" color="text.secondary">
            Realized P&L
          </Typography>
          <Typography
            variant="bodyMediumStrong"
            sx={{
              color:
                summary.realizedPnlUsd >= 0
                  ? (theme.vars || theme).palette.success.main
                  : (theme.vars || theme).palette.error.main,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {summary.realizedPnlUsd >= 0 ? '+' : ''}
            {formatUsd(summary.realizedPnlUsd)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="bodyXSmall" color="text.secondary">
            Unrealized P&L
          </Typography>
          <Typography
            variant="bodyMediumStrong"
            sx={{
              color:
                summary.unrealizedPnlUsd >= 0
                  ? (theme.vars || theme).palette.success.main
                  : (theme.vars || theme).palette.error.main,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {summary.unrealizedPnlUsd >= 0 ? '+' : ''}
            {formatUsd(summary.unrealizedPnlUsd)}
          </Typography>
        </Box>
      </Box>

      {/* High / Low */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Box>
          <Typography variant="bodyXSmall" color="text.secondary">
            Period High
          </Typography>
          <Typography
            variant="bodyMediumStrong"
            sx={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {formatUsd(summary.highUsd)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="bodyXSmall" color="text.secondary">
            Period Low
          </Typography>
          <Typography
            variant="bodyMediumStrong"
            sx={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {formatUsd(summary.lowUsd)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
