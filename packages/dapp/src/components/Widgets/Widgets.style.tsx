import { Box, BoxProps, styled } from '@mui/material';

export interface WidgetContainerProps extends Omit<BoxProps, 'component'> {
  isActive?: boolean;
  welcomeScreenHover?: boolean;
  welcomeScreenClosed: boolean;
}

export const WidgetContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<WidgetContainerProps>(({ theme, isActive, welcomeScreenClosed }) => ({
  display: isActive ? 'inherit' : 'none',
  margin: '0 auto 24px',

  // setting hover animations on widget wrappers
  '& > .widget-wrapper > div , & > .onramper-wrapper': {
    transitionProperty: 'margin-top',
    transitionDuration: '.3s',
    transitionTimingFunction: 'ease-in-out',
    marginTop: !welcomeScreenClosed ? theme.spacing(16) : theme.spacing(3.5),
    cursor: 'pointer',
  },

  [`@media screen and (min-height: 700px)`]: {
    marginTop: !welcomeScreenClosed ? 'calc( 50vh - 680px / 2.75 - 80px)' : '0', // (mid viewheight - half-two/thirds widget height - header height )
  },

  [`@media screen and (min-height: 900px)`]: {
    marginTop: !welcomeScreenClosed
      ? 'calc( 50vh - 680px / 2.75 - 128px)'
      : '0', // (mid viewheight - half-two/thirds widget height - ( header height + additional spacing) )
  },

  // widget wrappers -> animations
  '& > .widget-wrapper > div:hover, & > .onramper-wrapper:hover':
    !welcomeScreenClosed && {
      marginTop: theme.spacing(10),
    },

  // dark widget overlay when welcome screen opened
  '& .widget-wrapper > div:before, & > .onramper-wrapper:after': {
    content: !welcomeScreenClosed && '" "',
    position: 'absolute',
    width: 'inherit',
    height: 'inherit',
    zIndex: 900,
    top: theme.spacing(4),
    left: 0,
    right: 0,
    bottom: 0,
    background:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, transparent 15%,  #000 40%)'
        : 'linear-gradient(180deg, transparent 15%, #fff 40%)',
    opacity: 0.5,
    margin: 'auto',
    transitionProperty: 'opacity, top, padding-top',
    transitionDuration: '.3s',
    transitionTimingFunction: 'ease-in-out',
    borderTopRightRadius: '12px',
    borderTopLeftRadius: '12px',
  },

  // dark widget overlay when welcome screen opened -> hover animation
  '& .widget-wrapper > div:hover:before, & > .onramper-wrapper .onramper-container:hover:before':
    {
      opacity: 0,
    },

  // radial shadow glow
  '& > .widget-wrapper:before, & > .onramper-wrapper:before': {
    content: !welcomeScreenClosed && '" "',
    transitionProperty: 'top, opacity',
    transitionDuration: '.4s',
    transitionTimingFunction: 'ease-in-out',
    background:
      theme.palette.mode === 'dark'
        ? 'radial-gradient(50% 50% at 50% 50%, #6600FF 0%, rgba(255, 255, 255, 0) 100%);'
        : 'radial-gradient(50% 50% at 50% 50%, #8700B8 0%, rgba(255, 255, 255, 0) 100%);',
    position: 'absolute',
    zIndex: -1,
    pointerEvents: 'none',
    width: '1080px',
    height: '1080px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    transform: 'translate(-50%, -50%)',
    left: '50%',
    top: '50%',
    opacity: theme.palette.mode === 'dark' ? 0.24 : 0.12,
  },

  // radial shadow glow -> animation
  '& > .widget-wrapper:hover:before, & > .onramper-wrapper:hover:before': {
    opacity: theme.palette.mode === 'dark' ? 0.48 : 0.34,
    top: '45%',
  },
}));
