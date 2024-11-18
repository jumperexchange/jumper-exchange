import { Box, Typography } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { alpha, styled } from '@mui/material/styles';

export const BerachainOverviewBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginTop: theme.spacing(20),
  justifyContent: 'space-between',
}));

export const BerachainProgressContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  [theme.breakpoints.up('md' as Breakpoint)]: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 0,
  },
}));
export const BerachainOverviewHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  [theme.breakpoints.up('md' as Breakpoint)]: {
    alignItems: 'center',
    flexDirection: 'row',
  },
}));

export const BerachainOverviewSubtitle = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.white.main, 0.5),
  marginTop: theme.spacing(0.5),
}));
