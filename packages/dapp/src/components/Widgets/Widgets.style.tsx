import { Box, BoxProps, Breakpoint } from '@mui/material';
import { styled } from '@mui/material/styles';
import { NavbarHeight } from '../Navbar/Navbar.style';

export interface WidgetContainerProps extends Omit<BoxProps, 'component'> {
  isActive?: boolean;
  showWelcome?: boolean;
  showFadeOut?: boolean;
}

const WidgetTopOffset = '62%';

export const WidgetContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'isActive' && prop !== 'showWelcome' && prop !== 'showFadeOut',
})<WidgetContainerProps>(({ theme, isActive, showWelcome, showFadeOut }) => ({
  '@keyframes moveToOrigin': {
    from: {
      marginTop: `calc( 100% - ${WidgetTopOffset} )`,
    },
    to: {
      marginTop: 0,
    },
  },
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
  maxHeight:
    showWelcome && !showFadeOut
      ? '50%'
      : showWelcome && showFadeOut
      ? `calc( 100svh - ${NavbarHeight.XS} )`
      : 'auto',
  minHeight: showWelcome && !showFadeOut && '50%',

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    height:
      showWelcome && !showFadeOut
        ? '50%'
        : showWelcome && showFadeOut
        ? `calc( 100svh - ${NavbarHeight.SM} )`
        : 'auto',
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    height:
      showWelcome && !showFadeOut
        ? '50%'
        : showWelcome && showFadeOut
        ? `calc( 100svh - ${NavbarHeight.LG} )`
        : 'auto',
  },

  '& .widget-wrapper > div, & > .onramper-wrapper .onramper-container': {
    alignSelf: showFadeOut && 'flex-end',
    height: '100%',
    maxHeight: showWelcome && !showFadeOut ? '350px' : '100%',
    display: 'flex',
    transitionProperty: showWelcome && 'height',
    transitionDuration: showWelcome && '.6s',
    transitionTimingFunction: showWelcome && 'ease-in-out',
    overflow: showWelcome ? 'hidden' : 'visible',
  },

  '& > .onramper-container': {
    overflow: showWelcome && !showFadeOut ? 'hidden' : 'visible',
  },

  '& .widget-wrapper > div:before, & > .onramper-wrapper:after': {
    content: showWelcome && !showFadeOut && '" "',
    position: 'absolute',
    left: 0,
    zIndex: 900,
    cursor: 'pointer',
    right: 0,
    bottom: 0,
    top: theme.spacing(6),
    background:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, transparent 0%, #000000 50%, #000000 100%)'
        : 'linear-gradient(180deg, transparent 0%, #ffffff 50%, #ffffff 100%)',

    opacity: 0.5,
    margin: 'auto',
    transitionProperty: showWelcome && 'opacity, top, background',
    transitionDuration: showWelcome && '.3s',
    transitionTimingFunction: showWelcome && 'ease-in-out',
    borderTopRightRadius: '12px',
    borderTopLeftRadius: '12px',
  },

  '& > .onramper-wrapper:after': {
    top: 0,
  },

  '& .widget-wrapper > div:hover:before, & > .onramper-wrapper  .onramper-container:hover:before':
    {
      top: 0,
      opacity: 0,
    },

  '& > .widget-wrapper > div, & > .onramper-wrapper': {
    paddingTop: theme.spacing(6),
    transitionProperty: showWelcome && !showFadeOut && 'padding-top',
    transitionDuration: showWelcome && '.3s',
    transitionTimingFunction: showWelcome && 'ease-in-out',
  },

  '& > .widget-wrapper, & > .onramper-wrapper': {
    overflow: showWelcome && !showFadeOut && 'visible',
    width: showWelcome && !showFadeOut && '100%',
    position: showWelcome && !showFadeOut && 'absolute',
    bottom: showWelcome && !showFadeOut && '0',
    height: showWelcome && !showFadeOut && '62%',
    maxHeight: showWelcome && !showFadeOut && '350px',
    animation: showWelcome && showFadeOut && 'moveToOrigin .6s 1 ease',
  },

  '& > .widget-wrapper:before, & > .onramper-wrapper:before': {
    content: showWelcome && '" "',
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
    width: '1080px',
    height: '1080px',
    maxWidth: '100svw',
    maxHeight: '100svh',
    transform: 'translate(-50%, -50%)',
    left: '50%',
    top: '50%',
  },

  '& > .widget-wrapper:hover:before, & > .onramper-wrapper:hover:before': {
    top: showFadeOut && 0,
    opacity: showFadeOut ? 0 : theme.palette.mode === 'dark' ? 0.48 : 0.26,
    background:
      theme.palette.mode === 'dark'
        ? 'radial-gradient(50% 50% at 50% 50%, #6600FF 0%, rgba(255, 255, 255, 0) 100%)'
        : 'radial-gradient(50% 50% at 50% 50%, #8700B8 0%, rgba(255, 255, 255, 0) 100%)',
  },

  '& > div > div:hover, & > .onramper-wrapper:hover': {
    paddingTop: showWelcome && !showFadeOut && theme.spacing(0),
  },
}));
