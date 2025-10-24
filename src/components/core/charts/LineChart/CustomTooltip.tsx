import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { FC } from 'react';
import { TooltipContentProps } from 'recharts/types/component/Tooltip';
import { toCompactValue } from 'src/utils/formatNumbers';

type ValueType = string | number;
type NameType = string;

interface CustomTooltipProps
  extends Pick<
    TooltipContentProps<ValueType, NameType>,
    'active' | 'payload' | 'label'
  > {
  dataSetId?: string;
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
      })}
    >
      <Typography
        variant="bodySmallStrong"
        style={{ textTransform: 'capitalize' }}
      >
        {format(label ?? '', 'PP p')}
      </Typography>
      <Typography variant="bodySmall">
        {!data.value || isNaN(Number(data.value))
          ? data.value
          : toCompactValue(data.value)}{' '}
        <strong>{dataSetId?.toString().toUpperCase()}</strong>
      </Typography>
    </Box>
  );
};
