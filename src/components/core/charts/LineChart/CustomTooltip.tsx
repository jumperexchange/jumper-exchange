import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { formatDateLocalized } from 'src/utils/formatDateLocalized';
import type { FC } from 'react';
import type { TooltipContentProps } from 'recharts/types/component/Tooltip';
import {
  formatValueWithConfig,
  type ValueFormatConfig,
} from 'src/utils/formatNumbers';

type ValueType = string | number;
type NameType = string;

interface CustomTooltipProps extends Pick<
  TooltipContentProps<ValueType, NameType>,
  'active' | 'payload' | 'label'
> {
  dataSetId?: string;
  valueFormatConfig?: ValueFormatConfig;
  x: number;
  y: number;
  transform?: string;
}

export const CustomTooltip: FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  x,
  y,
  transform,
  dataSetId,
  valueFormatConfig,
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <Box
      sx={(theme) => ({
        background: (theme.vars || theme).palette.surface1.main,
        color: (theme.vars || theme).palette.text.primary,
        padding: theme.spacing(1.5),
        display: 'inline-flex',
        width: 'fit-content',
        flexDirection: 'column',
        gap: theme.spacing(1),
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
        {data.value == null
          ? 'NULL'
          : valueFormatConfig
            ? formatValueWithConfig(data.value, valueFormatConfig)
            : data.value}{' '}
        <strong>{dataSetId?.toString().toUpperCase()}</strong>
      </Typography>
    </Box>
  );
};
