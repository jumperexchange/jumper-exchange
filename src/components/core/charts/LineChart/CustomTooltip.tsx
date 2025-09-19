import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { FC } from 'react';
import { TooltipContentProps } from 'recharts/types/component/Tooltip';

type ValueType = string | number;
type NameType = string;

interface CustomTooltipProps
  extends Pick<
    TooltipContentProps<ValueType, NameType>,
    'active' | 'payload' | 'label'
  > {
  dateFormat?: string;
  dataSetId?: string;
  x: number;
  y: number;
}

export const CustomTooltip: FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  x,
  y,
  dateFormat,
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
      })}
    >
      <Typography
        variant="bodySmallStrong"
        style={{ textTransform: 'capitalize' }}
      >
        {format(label ?? '', dateFormat ?? 'MMM yyyy')}
      </Typography>
      <Typography variant="bodySmall">
        {typeof data.value === 'number'
          ? data.value?.toFixed(2)
          : data.value?.toString()}{' '}
        <strong>{dataSetId?.toString().toUpperCase()}</strong>
      </Typography>
    </Box>
  );
};
