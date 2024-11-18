import { Box, Typography } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { alpha, styled } from '@mui/material/styles';

// outer container
export const BerachainMarketsFiltersContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: theme.spacing(5),
  gap: theme.spacing(3),
}));

// inner container
export const BerachainMarketsFiltersInnerContainer = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: theme.spacing(3),
  }),
);

export const BerachainMarketsFilterBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
}));

export const BerachainMarketsSortFilterBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  alignItems: 'flex-end',
  [theme.breakpoints.down('md' as Breakpoint)]: {
    flexDirection: 'row',
  },
}));

export const BerachainMarketsSortLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginLeft: '8px',
  height: '40px',
  alignContent: 'center',
  position: 'relative',
  '&:before': {
    content: '" "',
    position: 'absolute',
    display: 'block',
    height: '40px',
    width: '2px',
    background: alpha(theme.palette.white.main, 0.08),
    left: '-24px',
    top: 0,
  },
}));
