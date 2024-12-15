import { Box, Button, Typography } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { alpha, darken, styled } from '@mui/material/styles';
import Link from 'next/link';

export const BeraChainWelcomeBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '50vh',
  height: 'calc(45vh - 80px)',
  padding: theme.spacing(1),
}));

export const BeraChainWelcomeContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.white.main,
  textAlign: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: -112,
  zIndex: 1,
}));

// export const BerachainWelcomeSubtitleBox = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   marginTop: theme.spacing(5),
//   flexDirection: 'column',
//   [theme.breakpoints.up('sm' as Breakpoint)]: {
//     flexDirection: 'row',
//     marginTop: theme.spacing(3),
//   },
// }));

export const BerachainWelcomeSubtitleLabel = styled(Typography)(
  ({ theme }) => ({
    display: 'flex',
    alignContent: 'center',
    backgroundColor: '#FBC6A7',
    color: '#2C1A16',
    height: 24,
    padding: theme.spacing(0.25, 1.5),
    borderRadius: '12px',
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      marginTop: 0,
    },
  }),
);

export const BerachainWelcomeTitle = styled(Typography)(({ theme }) => ({
  letterSpacing: 0,
  [theme.breakpoints.down('md' as Breakpoint)]: {
    flexDirection: 'column',
    gap: '8px',
  },
}));

export const BerachainWelcomeSubtitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginTop: 0,
  },
}));

export const BerachainWelcomeBoxContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(1.5),
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginTop: theme.spacing(4),
    flexDirection: 'row',
  },
}));

export const BerachainWelcomeConnectButtonCTA = styled(Button)(({ theme }) => ({
  boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
  color: theme.palette.black.main,
  backgroundColor: theme.palette.white.main,
  padding: theme.spacing(1, 2),
  [theme.breakpoints.down('sm' as Breakpoint)]: {
    height: 40,
    width: '100%',
  },
  '&:hover': {
    backgroundColor: darken(theme.palette.white.main, 0.2),
  },
}));

export const BerachainButtonWrapperLink = styled(Link)(({ theme }) => ({
  [theme.breakpoints.down('sm' as Breakpoint)]: {
    width: '100%',
  },
}));

export const BerachainWelcomeLearnMoreButton = styled(Button)(({ theme }) => ({
  color: theme.palette.white.main,
  backgroundColor: alpha(theme.palette.white.main, 0.24),
  padding: theme.spacing(1, 2),
  [theme.breakpoints.down('sm' as Breakpoint)]: {
    height: 40,
    width: '100%',
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.white.main, 0.48),
  },
}));
