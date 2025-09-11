import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { FC } from 'react';

interface CustomTooltipProps {
  visible: boolean;
  x: number;
  y: number;
  price: number | string;
  time: number;
  dateFormat?: string;
  dataSetId?: string;
}

export const CustomTooltip: FC<CustomTooltipProps> = ({
  visible,
  x,
  y,
  price,
  time,
  dateFormat,
  dataSetId,
}) => {
  if (!visible) {
    return null;
  }

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
        {format(time ?? '', dateFormat ?? 'MMM yyyy')}
      </Typography>
      <Typography variant="bodySmall">
        {typeof price === 'number' ? price?.toFixed(2) : price?.toString()}{' '}
        <strong>{dataSetId?.toString().toUpperCase()}</strong>
      </Typography>
    </Box>
  );
};
