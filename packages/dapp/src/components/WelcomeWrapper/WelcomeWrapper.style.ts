import { Box, BoxProps, Breakpoint, Typography, styled } from '@mui/material';

export const Background = styled(Box)(({ theme }) => ({
  // backgroundColor: 'transparent',
  // position: 'fixed',
  // width: '100%',
  // top: '50%',
  // bottom: 0,
  // zIndex: 1300,
  // height: 'calc( 50% + 64px )',
  // [`@media screen and (max-height: 490px)`]: {
  //   height: 'auto',
  //   top: 0,
  // },
}));

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
  // '&:before': {
  //   content: '" "',
  //   height: '100%',
  //   background:
  //     theme.palette.mode === 'dark'
  //       ? 'linear-gradient(180deg, #170931 0%, #1A1033 21.15%)'
  //       : 'linear-gradient(180deg, #e8dafb 0%, #e8dafb 21.15%);',
  //   pointerEvents: 'none',
  //   position: 'absolute',
  //   left: 0,
  //   top: '0',
  //   zIndex: '-1',
  //   width: '100%',
  // },
}));
