import { Box, Button, Typography } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { alpha, darken, styled } from '@mui/material/styles';
import Image from 'next/image';

export const BeraChainWelcomeBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const BeraChainWelcomeContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.white.main,
  textAlign: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: -72,
  zIndex: 1,
}));

export const BeraChainWelcomeIllustrations = styled(Box)(({ theme }) => ({
  aspectRatio: 1.3,
  position: 'relative',
  padding: 0,
  width: '100%',
  height: 'auto',
  border: '1px solid red',
  maxWidth: 474,
}));

export const BeraChainWelcomeBear = styled(Image)(({ theme }) => ({
  // [theme.breakpoints.down('sm' as Breakpoint)]: {
  //   width: '100%',
  //   height: 'auto',
  // },
}));

export const BeraChainWelcomeSubtitleBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(5),
  flexDirection: 'column',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    flexDirection: 'row',
    marginTop: theme.spacing(3),
  },
}));

export const BeraChainWelcomeSubtitleLabel = styled(Typography)(
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

export const BeraChainWelcomeTitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  [theme.breakpoints.down('md' as Breakpoint)]: {
    flexDirection: 'column',
    gap: '8px',
  },
}));

export const BeraChainWelcomeSubtitle = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginTop: 0,
  },
}));

export const BeraChainWelcomeButtonsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginTop: theme.spacing(4),
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    flexDirection: 'row',
  },
}));

export const BeraChainWelcomeConnectButtonCTA = styled(Button)(({ theme }) => ({
  boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
  color: theme.palette.black.main,
  backgroundColor: theme.palette.white.main,
  '&:hover': {
    backgroundColor: darken(theme.palette.white.main, 0.2),
  },
}));

export const BeraChainWelcomeLearnMoreButton = styled(Button)(({ theme }) => ({
  color: theme.palette.white.main,
  backgroundColor: alpha(theme.palette.white.main, 0.24),
  '&:hover': {
    backgroundColor: alpha(theme.palette.white.main, 0.48),
  },
}));
