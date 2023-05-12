import { Grid, GridProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface WidgetContainerProps extends Omit<GridProps, 'component'> {
  isActive?: boolean;
  showWelcome?: boolean;
}

export const WidgetContainer = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'showWelcome',
})<WidgetContainerProps>(({ theme, isActive, showWelcome }) => ({
  display: isActive ? 'inherit' : 'none',
  height: showWelcome && '400px',
  zIndex: 1000,
  placeContent: 'center',
  paddingTop: theme.spacing(6),
  maskImage:
    showWelcome && 'linear-gradient(to bottom, black 0%, transparent 100%)',

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

  '& > .onramper-container:after, & > div > div:after': {
    content: showWelcome && '" "',
    position: 'absolute',
    zIndex: -1,
    minWidth: '440px',
    minHeight: '440px',
    width: '80vw',
    height: '80vw',
    transform: 'translateX(-50%)',
    left: '50%',
    top: '0px',
    pointerEvents: 'none',
    background:
      'radial-gradient(50% 50% at 50% 50%, #8700B8 0%, rgba(255, 255, 255, 0) 100%)',
  },

  '& .widget-wrapper div:hover > .glow-bg': {
    opacity: showWelcome && 1,
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

  '& > div > div, & > .onramper-container': {
    overflow: showWelcome && 'hidden',
    opacity: showWelcome && 0.5,
    transitionProperty: 'padding-top, opacity, top',
    transitionDuration: '.3s',
    transitionTimingFunction: 'ease-in-out',
  },

  '& > div > div:hover, & > .onramper-container:hover': {
    top: showWelcome && 0,
    paddingTop: showWelcome && theme.spacing(0),
    opacity: showWelcome && 1,
  },

  '& > div > div:hover:after': {
    content: showWelcome && '" "',
    position: 'absolute',
    zIndex: -1,
    minWidth: '440px',
    minHeight: '440px',
    width: '80vw',
    height: '80vw',
    transform: 'translateX(-50%)',
    left: '50%',
    top: '0px',
    background:
      'radial-gradient(50% 50% at 50% 50%, #8700B8 0%, rgba(255, 255, 255, 0) 100%)',
  },
}));
