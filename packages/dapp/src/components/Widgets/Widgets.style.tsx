import { Box, BoxProps, styled } from '@mui/material';

export interface WidgetContainerProps extends Omit<BoxProps, 'component'> {
  isActive?: boolean;
  welcomeScreenHover?: boolean;
  welcomeScreenClosed: boolean;
}

const opacityMap = {
  dark: {
    true: 0.48, //hover
    false: 0.24, //no-hover
  },
  light: {
    true: 0.34, //hover
    false: 0.12, //no-hover
  },
};

export const WidgetContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<WidgetContainerProps>(({ theme, isActive, welcomeScreenClosed }) => ({
  display: isActive ? 'inherit' : 'none',
  margin: '0 auto 24px',

  '& > .widget-wrapper > div , & > .onramper-wrapper': {
    transitionProperty: 'padding-top',
    transitionDuration: '.3s',
    transitionTimingFunction: 'ease-in-out',
    paddingTop: !welcomeScreenClosed ? theme.spacing(14) : theme.spacing(4),
  },

  '& > .widget-wrapper > div:hover, & > .onramper-wrapper:hover': {
    paddingTop: theme.spacing(10),
  },

  // Hover-Transition
  // '& > div > div, & > .onramper-wrapper': {
  //   paddingTop: welcomeScreenHover && theme.spacing(0),
  // },

  // Background-Gradients
  '& .widget-wrapper > div:before, & > .onramper-wrapper:after': {
    content: !welcomeScreenClosed && '" "',
    position: 'absolute',
    left: 0,
    zIndex: 900,
    right: 0,
    bottom: 0,

    background:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, transparent 0%, #000000 50%, #000000 100%)'
        : 'linear-gradient(180deg, transparent 0%, #ffffff 50%, #ffffff 100%)',

    opacity: 0.5,
    margin: 'auto',
    transitionProperty: 'opacity, top, padding-top',
    transitionDuration: '.3s',
    transitionTimingFunction: 'ease-in-out',
    borderTopRightRadius: '12px',
    borderTopLeftRadius: '12px',
  },

  // '& > .widget-wrapper:before, & > .onramper-wrapper:before': {
  //   content: !welcomeScreenClosed && '" "',
  //   transitionProperty: 'top, opacity',
  //   transitionDuration: '.4s',
  //   transitionTimingFunction: 'ease-in-out',
  //   background:
  //     theme.palette.mode === 'dark'
  //       ? 'radial-gradient(50% 50% at 50% 50%, #6600FF 0%, rgba(255, 255, 255, 0) 100%);'
  //       : 'radial-gradient(50% 50% at 50% 50%, #8700B8 0%, rgba(255, 255, 255, 0) 100%);',
  //   position: 'absolute',
  //   zIndex: -1,
  //   pointerEvents: 'none',
  //   width: '1080px',
  //   height: '1080px',
  //   maxWidth: '90vw',
  //   maxHeight: '90vh',
  //   transform: 'translate(-50%, -50%)',
  //   left: '50%',
  //   top: '50%',
  //   opacity: welcomeScreenHover
  //     ? opacityMap[theme.palette.mode]['true']
  //     : opacityMap[theme.palette.mode]['false'],
  // },
}));
