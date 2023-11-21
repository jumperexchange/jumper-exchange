import { Box, BoxProps, styled } from '@mui/material';

export interface WidgetContainerProps extends Omit<BoxProps, 'component'> {
  isActive?: boolean;
  welcomeScreenClosed: boolean;
}

export const hoverOffset = '24px';

export const WidgetContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'isActive' && prop !== 'welcomeScreenClosed',
})<WidgetContainerProps>(({ theme, isActive, welcomeScreenClosed }) => ({
  display: isActive ? 'grid' : 'none',
  margin: '0 auto 24px',
  overflow: !welcomeScreenClosed ? 'hidden' : 'inherit',
  width: 'fit-content',
  gridTemplateRows: !welcomeScreenClosed ? '28px 1fr 200px' : '28px 0fr 1fr',
  transitionProperty: 'grid-template-rows, max-height',
  transitionDuration: '.5s',
  transitionTimingFunction: 'ease-in-out',
  minHeight: '50vh',

  [`@media screen and (min-height: 700px)`]: {
    gridTemplateRows: !welcomeScreenClosed ? '1fr 1fr 350px' : '28px 0fr 1fr',
    height: 'inherit',
  },

  [`@media screen and (min-height: 900px)`]: {
    gridTemplateRows: !welcomeScreenClosed ? '1fr 1fr 350px' : '28px 0r 1fr',
  },

  // setting hover animations on widget wrappers
  '& > .widget-wrapper > div': {
    cursor: 'pointer',
    position: 'relative',
  },

  // widget wrappers -> animations
  '& > .widget-wrapper > div:hover, & > .onramper-wrapper:hover':
    !welcomeScreenClosed && {
      marginTop: !welcomeScreenClosed
        ? `calc( ${theme.spacing(10) + hoverOffset} )`
        : hoverOffset,
    },

  // dark widget overlay when welcome screen opened
  '& .widget-wrapper > div:before': {
    content: !welcomeScreenClosed && '" "',
    position: 'absolute',
    width: 'inherit',
    height: 'inherit',
    zIndex: 900,
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
  '&:before': {
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
  '&:hover:before': {
    opacity: theme.palette.mode === 'dark' ? 0.48 : 0.34,
    top: '45%',
  },

  // position radial shadow glow on buy tab to sync with other tabs
  '& > .onramper-wrapper:before': {
    top: 'calc( 50% + 48px )',
  },

  '& > .onramper-wrapper:hover:before': {
    top: 'calc( 45% + 24px )',
  },
}));
