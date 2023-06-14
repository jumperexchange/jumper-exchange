import { Box, BoxProps, Breakpoint, Typography, styled } from '@mui/material';

export const CustomColor = styled(Typography)(({ theme }) => ({
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(270deg, #D35CFF 0%, #BEA0EB 94.17%)'
      : 'linear-gradient(270deg, #31007A 0%, #8700B8 94.17%);',
  backgroundClip: 'text',
  textFillColor: 'transparent',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    fontSize: '48px',
    fontWeight: 700,
    lineHeight: '56px',
  },
}));

export const ColoredContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  height: '50%',
  width: '100%',
}));

export interface ContentContainerProps extends Omit<BoxProps, 'component'> {
  showWelcome?: boolean;
}

export const ContentContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'showWelcome',
})<ContentContainerProps>(({ theme, showWelcome }) => ({
  '@keyframes fadeOut': {
    from: {
      opacity: 1,
    },
    to: {
      opacity: 0,
    },
  },
  textAlign: 'center',
  bottom: 0,
  height: showWelcome ? '50%' : 'auto',
  minHeight: showWelcome && 'fit-content',
  background: theme.palette.mode === 'dark' ? '#1A1033' : '#F3EBFF',
  width: '100%',
  position: 'absolute',
  zIndex: '1400',
  top: showWelcome && '50%',
  padding: theme.spacing(0, 2, 8),
  overflow: showWelcome ? 'visible' : 'hidden',

  '&:before': {
    content: '" "',
    position: 'absolute',
    height: '35%',
    top: '-35%',
    pointerEvents: 'none',
    left: '0',
    right: '0',
    background:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(to top, #1A1033 0%, transparent 100%)'
        : 'linear-gradient(to top, #F3EBFF 0%, transparent 100%)',
    zIndex: '1000',
  },

  [`@media screen and (min-height: 490px)`]: {
    padding: theme.spacing(2, 2, 6),

    '&:before': {
      top: '-200px',
      height: '200px',
    },
  },
}));
