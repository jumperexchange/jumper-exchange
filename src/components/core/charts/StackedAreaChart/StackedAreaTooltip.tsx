import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { formatDateLocalized } from 'src/utils/formatDateLocalized';
import type { FC } from 'react';
import {
  formatValueWithConfig,
  type ValueFormatConfig,
} from 'src/utils/formatNumbers';
import type { StackedChartDataPoint } from './StackedAreaChart';

interface StackedAreaTooltipProps {
  active?: boolean;
  payload: StackedChartDataPoint;
  label: string;
  valueFormatConfig?: ValueFormatConfig;
  x: number;
  y: number;
  transform?: string;
}

export const StackedAreaTooltip: FC<StackedAreaTooltipProps> = ({
  active,
  payload,
  label,
  x,
  y,
  transform,
  valueFormatConfig,
}) => {
  if (!active || !payload) {
    return null;
  }

  const formatValue = (value: number | null | undefined) => {
    if (value == null) {
      return 'NULL';
    }
    if (valueFormatConfig) {
      return formatValueWithConfig(value, valueFormatConfig);
    }
    return value.toFixed(2);
  };

  const { total } = payload;

  return (
    <Box
      sx={(theme) => ({
        background: (theme.vars || theme).palette.surface1.main,
        color: (theme.vars || theme).palette.text.primary,
        padding: theme.spacing(1.5),
        display: 'inline-flex',
        width: 'fit-content',
        flexDirection: 'column',
        gap: theme.spacing(0.5),
        borderRadius: theme.spacing(2),
        boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)',
        whiteSpace: 'nowrap',
        position: 'absolute',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 1000,
        transform,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      })}
    >
      <Typography
        variant="bodySmallStrong"
        style={{ textTransform: 'capitalize' }}
      >
        {formatDateLocalized(label ?? '', 'PP @ HH:mm')}
      </Typography>
      <Typography variant="bodySmall">
        Total: {formatValue(total)} <strong>APY</strong>
      </Typography>
      {payload.base != null && payload.base !== 0 && (
        <Typography
          variant="bodyXSmall"
          sx={(theme) => ({
            color: (theme.vars || theme).palette.text.secondary,
          })}
        >
          Base: {formatValue(payload.base)}
        </Typography>
      )}
      {payload.reward != null && payload.reward !== 0 && (
        <Typography
          variant="bodyXSmall"
          sx={(theme) => ({
            color: (theme.vars || theme).palette.text.secondary,
          })}
        >
          Reward: {formatValue(payload.reward)}
        </Typography>
      )}
      {payload.intrinsic != null && payload.intrinsic !== 0 && (
        <Typography
          variant="bodyXSmall"
          sx={(theme) => ({
            color: (theme.vars || theme).palette.text.secondary,
          })}
        >
          Intrinsic: {formatValue(payload.intrinsic)}
        </Typography>
      )}
    </Box>
  );
};
