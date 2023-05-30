import { Box, Breakpoint, Typography, styled } from '@mui/material';

export const Background = styled('div')(({ theme }) => ({
  backgroundColor: 'transparent',
  // overflow: 'hidden',
  position: 'fixed',
  width: '100%',
  top: '50%',
  bottom: 0,
  // filter: 'drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.04))',
  height: '50%',
  zIndex: 1300,
  // overflow: 'initial',

  [`@media screen and (max-height: 490px)`]: {
    height: 'auto',
    top: 0,
  },
  // pointerEvents: 'none',

  // ':before': {
  //   content: '" "',
  //   height: '100%',
  //   width: '100%',
  //   position: 'fixed',
  //   left: 0,
  //   right: 0,
  //   top: 0,
  //   bottom: 0,
  //   pointerEvents: 'none',
  //   background:
  //     theme.palette.mode === 'dark'
  //       ? theme.palette.bg.main
  //       : ' linear-gradient(180deg, rgba(237, 224, 255, 0) 0%, #EDE0FF 49.48%, #F3EBFF 97.4%)',
  //   zIndex: -1,
  // },
  // ':after': {
  //   content: '" "',
  //   height: '100%',
  //   width: '100%',
  //   position: 'fixed',
  //   left: '50%',
  //   opacity: 0.24,
  //   right: 0,
  //   top: '50%',
  //   transform: 'translate(-50%, -100%)',
  //   bottom: 0,
  //   pointerEvents: 'none',
  //   background:
  //     'radial-gradient(50% 50% at 50% 50%, rgba(190, 160, 235, 0.4) 0%, rgba(190, 160, 235, 0) 100%)',
  //   zIndex: -1,
  // },
  // [theme.breakpoints.up('sm' as Breakpoint)]: {
  //   height: `calc( 100% + ${NavbarHeight.SM} )`,
  //   top: `-${NavbarHeight.SM}`,
  // },
  // [theme.breakpoints.up('md' as Breakpoint)]: {
  //   height: `calc( 100% + ${NavbarHeight.LG} )`,
  //   top: `-${NavbarHeight.LG}`,
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

export const ContentContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  bottom: 0,
  height: 'auto',
  width: '100%',
  position: 'absolute',
  transform: 'translateY(0%)',
  padding: theme.spacing(0, 2, 8),
  [`@media screen and (min-height: 490px)`]: {
    transform: 'unset',
    // top: '50%',
    bottom: 0,
    paddingBottom: theme.spacing(8),
    height: '100%',
  },
  '&:before': {
    content: '" "',
    height: '200%',
    background:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, rgba(26, 16, 51, 0) 0%, #1a103370 21.15%)'
        : 'linear-gradient(180deg, rgba(243, 235, 255, 0) 0%, #f3ebff7a 21.15%);',
    pointerEvents: 'none',
    position: 'absolute',
    left: 0,
    top: '-50vh',
    zIndex: '-1',
    width: '100%',
  },
  // [theme.breakpoints.up('xl' as Breakpoint)]: {
  //   '&:before': {
  //     content: 'unset',
  //   },
  // },
}));
