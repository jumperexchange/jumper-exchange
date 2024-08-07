import type { Breakpoint } from '@mui/material';
import { Box, alpha, styled } from '@mui/material';

export const LeaderboardContainer = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? alpha(theme.palette.white.main, 0.48)
      : alpha(theme.palette.white.main, 0.12),
  borderRadius: '32px',
  width:'100%',
  padding: theme.spacing(4),
  margin: theme.spacing(4, 0, 0),
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)',
  // [theme.breakpoints.up('sm' as Breakpoint)]: {
  //   margin: theme.spacing(2, 8, 0),
  //   padding: theme.spacing(3),
  // },
  // [theme.breakpoints.up('md' as Breakpoint)]: {
  //   padding: theme.spacing(4),
  //   margin: theme.spacing(12, 8, 0),
  // },
  // [theme.breakpoints.up('lg' as Breakpoint)]: {
  //   padding: theme.spacing(6),
  // },
  // [theme.breakpoints.up('xl' as Breakpoint)]: {
  //   margin: `${theme.spacing(12, 'auto', 0)}`,
  //   maxWidth: theme.breakpoints.values.xl,
  // },
}));