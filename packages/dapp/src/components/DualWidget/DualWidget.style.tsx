import { Grid, GridProps } from '@mui/material';
import { keyframes, styled } from '@mui/material/styles';

export interface WidgetContainerProps extends Omit<GridProps, 'component'> {
  isActive?: boolean;
  showWelcome?: boolean;
}

export const keyframesGlow = (theme) => keyframes`
0% {
  top: 20%;
  opacity: 
}
50% {
  top: 50%;
  opacity: ${theme.palette.mode === 'dark' ? 0.48 : 0.32};
}
100% {
  top: 20%;
  opacity: 
}
`;

export const WidgetContainer = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'showWelcome',
})<WidgetContainerProps>(({ theme, isActive, showWelcome }) => ({
  display: isActive ? 'inherit' : 'none',
  height: showWelcome && '50vh',
  placeContent: 'center',
  paddingTop: showWelcome ? 'unset' : theme.spacing(6),
  minHeight: showWelcome && '250px',
  maskImage:
    showWelcome && 'linear-gradient(to bottom, black 0%, transparent 100%)',
  zIndex: showWelcome && 1500,
  [`@media screen and (max-height: 650px)`]: {
    display: showWelcome && 'none',
  },

  '& .widget-wrapper': {
    height: showWelcome && '66%',
    maxHeight: showWelcome && '350px',
    position: showWelcome && 'absolute',
    bottom: showWelcome && '0',
  },

  '& .widget-wrapper div:before, & > .onramper-container:hover:before': {
    content: showWelcome && '" "',
    position: 'absolute',
    left: 0,
    zIndex: 900,
    cursor: 'pointer',
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    width: '392px',
    margin: 'auto',
    borderRadius: '12px',
  },

  '& > .onramper-container:hover:before': {
    height: '100%',
  },

  '& > div > div:hover .widget-wrapper:before': {
    top: showWelcome && theme.spacing(6),
  },

  '& > div > div:hover:before': {
    top: showWelcome && 0,
  },

  '& > .widget-wrapper > div, & > .onramper-container': {
    paddingTop: showWelcome && theme.spacing(6),
  },

  '& > .onramper-container iframe': {
    height: showWelcome && '800px',
  },

  '& > div > div': {
    top: showWelcome && theme.spacing(6),
  },

  '& > .onramper-container': {
    height: showWelcome && '66.6%',
    overflow: showWelcome && 'visible',
    maxHeight: showWelcome && '350px',
    position: showWelcome && 'absolute',
    bottom: showWelcome && '0',
  },

  '& > div > div, & > div > div:after, & > .onramper-container': {
    // overflow: showWelcome && 'hidden',
    opacity: showWelcome && 0.75,
    transitionProperty: showWelcome && 'padding-top, opacity, top',
    transitionDuration: showWelcome && '.3s',
    transitionTimingFunction: showWelcome && 'ease-in-out',
  },

  '& > div > div:hover, & > .onramper-container:hover': {
    top: showWelcome && 0,
    paddingTop: showWelcome && theme.spacing(0),
    opacity: showWelcome && 1,
  },

  '& > .onramper-container:hover': {
    overflow: 'visible',
    top: 'unset',
  },

  '& > div > div:after, & > .onramper-container:after': {
    content: showWelcome && '" "',
    position: 'absolute',
    zIndex: -1,
    opacity: theme.palette.mode === 'dark' ? 0.24 : 0.12,
    minWidth: '440px',
    minHeight: '440px',
    pointerEvents: 'none',
    width: '75vw',
    height: '75vw',
    transform: 'translate(-50%, -100%)',
    left: '50%',
    top: 'calc( 75vw / 2 )',
    transitionProperty: ' top, opacity',
    transitionDuration: '0.6s',
    transitionTimingFunction: 'ease-in-out',
    background:
      theme.palette.mode === 'dark'
        ? 'radial-gradient(50% 50% at 50% 50%, #6600FF 0%, rgba(255, 255, 255, 0) 100%);'
        : 'radial-gradient(50% 50% at 50% 50%, #8700B8 0%, rgba(255, 255, 255, 0) 100%)',
  },

  '& > div > div:hover:after, & > .onramper-container:hover:after': {
    content: showWelcome && '" "',
    position: 'absolute',
    zIndex: -1,
    opacity: theme.palette.mode === 'dark' ? 0.48 : 0.32,
    minWidth: '440px',
    minHeight: '440px',
    width: '100vw',
    height: '100vw',
    transform: 'translate(-50%, -50%)',
    left: '50%',
    top: '50%',
    background:
      theme.palette.mode === 'dark'
        ? 'radial-gradient(50% 50% at 50% 50%, #6600FF 0%, rgba(255, 255, 255, 0) 100%)'
        : 'radial-gradient(50% 50% at 50% 50%, #8700B8 0%, rgba(255, 255, 255, 0) 100%)',
  },
}));
