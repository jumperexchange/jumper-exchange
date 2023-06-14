import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface WidgetContainerProps extends Omit<BoxProps, 'component'> {
  isActive?: boolean;
  showWelcome?: boolean;
}

export const WidgetContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'showWelcome',
})<WidgetContainerProps>(({ theme, isActive, showWelcome }) => ({
  display: isActive ? 'inherit' : 'none',
  placeContent: 'center',
  position: showWelcome ? 'relative' : 'inherit',
  zIndex: showWelcome && 1400,
  overflow: 'visible',
  width: '392px',
  margin: 'auto',
  maxHeight: showWelcome ? '50%' : 'auto',
  minHeight: isActive && showWelcome && '50%',

  '& .widget-wrapper > div, & > .onramper-wrapper .onramper-container': {
    alignSelf: 'flex-end',
    height: '100%',
    maxHeight: showWelcome ? '250px' : '100%',
    display: 'flex',
    overflow: showWelcome ? 'hidden' : 'visible',
  },

  '& > .onramper-container': {
    overflow: showWelcome ? 'hidden' : 'visible',
  },

  '& .widget-wrapper > div:before, & > .onramper-wrapper:after': {
    content: showWelcome && '" "',
    position: 'absolute',
    left: 0,
    zIndex: 900,
    cursor: 'pointer',
    right: 0,
    bottom: 0,
    height: '100%',
    background:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, transparent 0%, #000000 50%, #000000 100%)'
        : 'linear-gradient(180deg, transparent 0%, #ffffff 50%, #ffffff 100%)',

    opacity: 0.5,
    margin: 'auto',
    transitionProperty: showWelcome && 'opacity, background',
    transitionDuration: showWelcome && '.3s',
    transitionTimingFunction: showWelcome && 'ease-in-out',
    borderTopRightRadius: '12px',
    borderTopLeftRadius: '12px',
  },

  '& > .onramper-wrapper:after': {
    top: 0,
  },

  '& .widget-wrapper > div:hover:before, & > .onramper-wrapper .onramper-container:hover:before':
    {
      opacity: 0,
    },

  '& > .widget-wrapper > div, & > .onramper-wrapper': {
    overflow: 'hidden',
    paddingTop: showWelcome ? theme.spacing(6) : theme.spacing(7),
    transitionProperty: showWelcome && 'padding-top',
    transitionDuration: showWelcome && '.3s',
    transitionTimingFunction: showWelcome && 'ease-in-out',
    [`@media screen and (min-height: 600px)`]: {
      overflow: 'visible',
    },
  },

  '& > .widget-wrapper, & > .onramper-wrapper': {
    overflow: showWelcome && 'visible',
    width: showWelcome && '100%',
    // position: 'absolute',
    // top: showWelcome ? '-100%' : 'unset',
    height: showWelcome && '100%',
    maxHeight: showWelcome && '250px',
    transitionProperty: 'margin-top, padding-top, transform',
    transitionDuration: '.3s',
    transitionTimingFunction: 'ease-in-out',
    marginTop: showWelcome ? '10%' : '0',
    // transform: showWelcome && 'translateY( 100% )',

    [`@media screen and (min-height: 700px)`]: {
      marginTop: showWelcome ? 'calc( 50vh - 75%)' : '0',
    },
  },

  '& > .widget-wrapper:before, & > .onramper-wrapper:before': {
    content: showWelcome && '" "',
    transitionProperty: 'top, opacity, background',
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
    maxWidth: '90svw',
    maxHeight: '90svh',
    transform: 'translate(-50%, -50%)',
    left: '50%',
    top: '50%',
  },

  '& > .widget-wrapper:hover:before, & > .onramper-wrapper:hover:before': {
    top: '50%',
    opacity: theme.palette.mode === 'dark' ? 0.48 : 0.26,
    background:
      theme.palette.mode === 'dark'
        ? 'radial-gradient(50% 50% at 50% 50%, #6600FF 0%, rgba(255, 255, 255, 0) 100%)'
        : 'radial-gradient(50% 50% at 50% 50%, #8700B8 0%, rgba(255, 255, 255, 0) 100%)',
  },

  '& > div > div:hover, & > .onramper-wrapper:hover': {
    paddingTop: showWelcome && theme.spacing(0),
  },
}));
