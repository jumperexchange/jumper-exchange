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
  showFadeOut?: boolean;
}

export const ContentContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'showWelcome' && prop !== 'showFadeOut',
})<ContentContainerProps>(({ theme, showWelcome, showFadeOut }) => ({
  textAlign: 'center',
  bottom: 0,
  height: 'auto',
  width: '100%',
  position: showWelcome && showFadeOut ? 'absolute' : 'inherit',
  top: showWelcome && showFadeOut && '50%',
  padding: theme.spacing(20, 2, 8),
  [`@media screen and (min-height: 490px)`]: {
    transform: 'unset',
    bottom: 0,
    padding: theme.spacing(2, 2, 8),
  },
}));
