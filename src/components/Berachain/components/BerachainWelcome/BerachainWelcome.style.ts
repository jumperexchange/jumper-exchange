import { Box, Button, Typography } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { alpha, darken, keyframes, styled } from '@mui/material/styles';
import Image from 'next/image';

export const BeraChainWelcomeBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 'calc( 20vh - 80px)',
}));

const BeraChainWelcomeContentAnimation = keyframes`
  from {
    opacity: 0;
    margin-top: 120px;
  }
  to {
    opacity: 1;
    margin-top: 0px;
  }
`;

export const BeraChainWelcomeContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.white.main,
  textAlign: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: -112,
  zIndex: 1,
  animation: `${BeraChainWelcomeContentAnimation} 1s`,
  animationDelay: '2s',
  animationIterationCount: 1,
}));

const BeraChainWelcomeIllustrationsGlitch = keyframes`
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  15% {
    filter: blur(4px) invert(1);
    margin-left: -6px;
  }
  17% {
    filter: blur(0px) invert(0);
    margin-left: 8px;
  }
  20% {
    margin-left: 0px;

  }
  31% {
    opacity: 0.5;
    filter: blur(0px) invert(0);
    margin-left: -6px;
  }
  34% {
    opacity: 0;
    margin-left: 4px;
    filter: blur(2px) invert(0.5);
  }
  35% {
    opacity: 1;
    filter: blur(0px) invert(0);
    margin-left: 0px;
  }
  40% {
    opacity: 0.5;
    margin-left: -4px;
  }
  42% {
    opacity: 1;
    margin-left: 4px;
  }
  50% {
    opacity: 0.7;
    margin-left: 0px;
  }
  52 {
    opacity: 1;
  }
  54% {
    opacity: 0.2;
    filter: blur(4px) invert(0.7);
  }
  65 {
    opacity: 1;
    filter: blur(0px) invert(0);
  }
  75% {
    opacity: 0.5;
    transform: translateX(3px);
  }xx^xX^^
  100% {
    opacity: 1;
    margin-left: 0px^x^x;
    filter: blur(0px)xw invert(0);  
    }
`;

export const BeraChainWelcomeIllustrations = styled(Box)(() => ({
  aspectRatio: 1.3,
  position: 'relative',
  padding: 0,
  width: '100%',
  height: 'auto',
  border: '1px solid red',
  maxWidth: 474,
  animation: `${BeraChainWelcomeIllustrationsGlitch} 3s`,
  animationIterationCount: 1,
  animationDelay: '1.5s',
}));

export const BerachainWelcomeBear = styled(Image)(() => ({
  position: 'absolute',
  aspectRatio: 0.8,
  height: '100%',
  width: 'auto',
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
  flexDirection: 'column',
  marginTop: theme.spacing(4),
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    flexDirection: 'row',
  },
}));

export const BerachainWelcomeConnectButtonCTA = styled(Button)(({ theme }) => ({
  boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
  color: theme.palette.black.main,
  backgroundColor: theme.palette.white.main,
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: darken(theme.palette.white.main, 0.2),
  },
}));

export const BerachainWelcomeLearnMoreButton = styled(Button)(({ theme }) => ({
  color: theme.palette.white.main,
  backgroundColor: alpha(theme.palette.white.main, 0.24),
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: alpha(theme.palette.white.main, 0.48),
  },
}));
