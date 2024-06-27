import { Box, Breakpoint, styled } from '@mui/material';

export const HeroMainBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('md' as Breakpoint)]: {
    marginTop: '16px',
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    marginTop: '64px',
  },
}));
