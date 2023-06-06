import { Breakpoint, Grid, GridProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { NavbarHeight } from '../Navbar/Navbar.style';

export interface WidgetContainerProps extends Omit<GridProps, 'component'> {
  isActive?: boolean;
  showWelcome?: boolean;
  showFadeOut?: boolean;
}

export const WidgetContainer = styled(Grid, {
  shouldForwardProp: (prop) =>
    prop !== 'isActive' && prop !== 'showWelcome' && prop !== 'showFadeOut',
})<WidgetContainerProps>(({ theme, isActive, showWelcome, showFadeOut }) => ({
  display:
    isActive && showWelcome
      ? 'flex'
      : isActive && !showWelcome
      ? 'inherit'
      : 'none',
  placeContent: 'center',
  position: showWelcome && !showFadeOut ? 'relative' : 'inherit',
  zIndex: showWelcome && 1500,
  overflow: 'visible',
  width: '392px',
  margin: 'auto',
  height:
    showWelcome && !showFadeOut
      ? `calc( 50% - ${NavbarHeight.XS} / 2 )`
      : 'auto',
  minHeight:
    showWelcome && !showFadeOut && `calc( 50% - ${NavbarHeight.XS} / 2 )`,

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    height:
      showWelcome && !showFadeOut && `calc( 50% - ${NavbarHeight.SM} / 2 )`,
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    height:
      showWelcome && !showFadeOut && `calc( 50% - ${NavbarHeight.LG} / 2 )`,
  },

  '&:after': {
    content: showWelcome && !showFadeOut && '" "',
    background:
      showWelcome && theme.palette.mode === 'dark'
        ? 'linear-gradient(to top, #1a1033 0%, transparent 100%)'
        : showWelcome && theme.palette.mode === 'light'
        ? 'linear-gradient(to top, #f2e9ff 0%, transparent 100%)'
        : 'transparent',
    position: 'absolute',
    height: '150px',
    pointerEvents: 'none',
    zIndex: 1000,
    left: 0,
    right: 0,
    bottom: '-4px',
  },

  '& .widget-wrapper > div, & > .onramper-wrapper .onramper-container': {
    alignSelf: showFadeOut && 'flex-end',
    left: showWelcome ? '50%' : 0,
    transform: showWelcome && !showFadeOut && 'translateX(-50%)',
    height:
      showWelcome && !showFadeOut
        ? '62%'
        : showWelcome && !showFadeOut
        ? '100%'
        : '100%',
    maxHeight:
      showWelcome && !showFadeOut
        ? '350px'
        : showWelcome && showFadeOut
        ? '100%'
        : '100%',
    position: showWelcome && !showFadeOut && 'absolute',
    transitionProperty: showWelcome && 'height',
    transitionDuration: showWelcome && '.6s',
    transitionTimingFunction: showWelcome && 'ease-in-out',
    bottom: showWelcome && '0',
    overflow: showWelcome ? 'hidden' : 'visible',
  },

  '& > .onramper-container': {
    overflow: showWelcome && !showFadeOut ? 'hidden' : 'visible',
  },

  '& .widget-wrapper > div:before, & > .onramper-wrapper  .onramper-container:before':
    {
      content: showWelcome && !showFadeOut && '" "',
      top: 0,
      position: 'absolute',
      left: 0,
      zIndex: 900,
      cursor: 'pointer',
      right: 0,
      bottom: 0,
      background: 'transparent',
      opacity: 0.5,
      margin: 'auto',
      transitionProperty: showWelcome && 'opacity',
      transitionDuration: showWelcome && '.3s',
      transitionTimingFunction: showWelcome && 'ease-in-out',
      borderTopRightRadius: '12px',
      borderTopLeftRadius: '12px',
    },

  '& > .widget-wrapper > div, & > .onramper-wrapper .onramper-container': {
    paddingTop: theme.spacing(6),
    transitionProperty: showWelcome && !showFadeOut && 'padding-top',
    transitionDuration: showWelcome && '.3s',
    transitionTimingFunction: showWelcome && 'ease-in-out',
  },

  '& > .widget-wrapper, & > .onramper-container': {
    height: showWelcome && !showFadeOut && '62%',
  },

  '& > .widget-wrapper:before, & > .onramper-wrapper:before': {
    content: showWelcome && !showFadeOut && '" "',
    transitionProperty: ' top, opacity, background',
    transitionDuration: '.3s',
    transitionTimingFunction: 'ease-in-out',
    background:
      theme.palette.mode === 'dark'
        ? 'radial-gradient(50% 50% at 50% 50%, #6600FF 0%, rgba(255, 255, 255, 0) 100%);'
        : 'radial-gradient(50% 50% at 50% 50%, #9747FF 0%, rgba(255, 255, 255, 0) 100%);',
    position: 'absolute',
    zIndex: -1,
    opacity: theme.palette.mode === 'dark' ? 0.24 : 0.12,
    pointerEvents: 'none',
    minWidth: '640px',
    minHeight: '640px',
    width: '1080px',
    height: '1080px',
    maxWidth: '100svw',
    maxHeight: '100svh',
    transform: 'translate(-50%, -75%)',
    left: '50%',
    top: '0%',
  },

  '& > onramper-wrapper .onramper-container:hover': {
    paddingTop: showWelcome && !showFadeOut && 0,
  },

  '& > .widget-wrapper:hover:before, & > .onramper-wrapper:hover:before': {
    opacity: theme.palette.mode === 'dark' ? 0.48 : 0.26,
    background:
      theme.palette.mode === 'dark'
        ? 'radial-gradient(50% 50% at 50% 50%, #6600FF 0%, rgba(255, 255, 255, 0) 100%)'
        : 'radial-gradient(50% 50% at 50% 50%, #8700B8 0%, rgba(255, 255, 255, 0) 100%)',
  },

  '& > .onramper-wrapper:hover .onramper-container': {
    paddingTop: showWelcome && !showFadeOut && 0,
  },

  '& > div > div:hover, & > .onramper-container:hover': {
    paddingTop: showWelcome && !showFadeOut && theme.spacing(0),
  },
}));
