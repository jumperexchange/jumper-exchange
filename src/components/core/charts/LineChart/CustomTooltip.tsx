import { LineSeries, SliceData } from '@nivo/line';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';

export const CustomTooltip = <T extends LineSeries>({
  slice,
  dateFormat,
}: {
  slice: SliceData<T>;
  dateFormat?: string;
}) => (
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
    })}
  >
    <Typography
      variant="bodySmallStrong"
      style={{ textTransform: 'capitalize' }}
    >
      {format(slice?.points?.[0]?.data?.x ?? '', dateFormat ?? 'MMM yyyy')}
    </Typography>
    <Typography variant="bodySmall">
      {typeof slice?.points?.[0]?.data?.y === 'number'
        ? slice?.points?.[0]?.data?.y?.toFixed(2)
        : slice?.points?.[0]?.data?.y?.toString()}{' '}
      <strong>{slice.points?.[0]?.seriesId?.toString().toUpperCase()}</strong>
    </Typography>
  </Box>
);
