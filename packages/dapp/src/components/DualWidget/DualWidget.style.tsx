import { Grid, GridProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface WidgetContainerProps extends Omit<GridProps, 'component'> {
  isActive?: boolean;
  showWelcome?: boolean;
  showFadeOut?: boolean;
}

export const WidgetContainer = styled(Grid, {
  shouldForwardProp: (prop) =>
    prop !== 'isActive' && prop !== 'showWelcome' && prop !== 'showFadeOut',
})<WidgetContainerProps>(({ theme, isActive, showWelcome, showFadeOut }) => ({
  display: isActive ? 'inherit' : 'none',
  height: showWelcome && !showFadeOut ? '45vh' : '100%',
  placeContent: 'center',
  paddingTop: showWelcome ? 'unset' : theme.spacing(6),
  minHeight: showWelcome && '250px',
  // maskImage:
  //   showWelcome && 'linear-gradient(to bottom, black 0%, transparent 100%)',

  // '&:after': {
  //   content: '" "',
  //   maskImage:
  //     showWelcome && 'linear-gradient(to top, black 0%, transparent 100%)',
  //   position: 'absolute',
  //   background: 'transparent',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   pointerEvents: 'none',
  // },

  zIndex: showWelcome && 1500,
  [`@media screen and (max-height: 490px)`]: {
    display: showWelcome && 'none',

    '& > .onramper-container, & .widget-wrapper': {
      top: showWelcome && '50%',
    },
  },

  // '&:before': {
  //   content: '" "',
  //   // background:
  //   //   theme.palette.mode === 'dark'
  //   //     ? theme.palette.bg.main
  //   //     : ' linear-gradient(180deg, rgba(237, 224, 255, 0) 0%, #EDE0FF 49.48%, #F3EBFF 97.4%)',
  //   position: 'absolute',
  //   top: 0,
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  // },

  '&:after': {
    content: showWelcome && !showFadeOut && '" "',
    background:
      showWelcome && theme.palette.mode === 'dark'
        ? 'linear-gradient(to top, #200a47 0%, transparent 100%)'
        : showWelcome && theme.palette.mode === 'light'
        ? 'linear-gradient(to top, #e8dafb 0%, transparent 100%)'
        : 'transparent',
    position: 'absolute',
    height: '150px',
    pointerEvents: 'none',
    left: 0,
    right: 0,
    bottom: '-4px',
    transitionProperty: showWelcome && 'height, bottom',
    transitionDuration: showWelcome && '.3s',
    transitionTimingFunction: showWelcome && 'ease-in-out',
  },

  '& .widget-wrapper, & > .onramper-container': {
    height: showWelcome && !showFadeOut && '62%',
    maxHeight: showWelcome && !showFadeOut && '350px',
    position: showWelcome && !showFadeOut && 'absolute',
    bottom: showWelcome && !showFadeOut && '0',
    overflow: showWelcome && !showFadeOut && 'visible',
  },

  '& .widget-wrapper > div:before, & > .onramper-container:before': {
    content: showWelcome && !showFadeOut && '" "',
    position: 'absolute',
    left: 0,
    zIndex: 900,
    cursor: 'pointer',
    right: 0,
    bottom: 0,
    // opacity: 0.5,
    background:
      showWelcome && !showFadeOut && theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, rgba(243, 235, 255, 0) 0%, #000000 80%)'
        : showWelcome && !showFadeOut && theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, rgba(243, 235, 255, 0) 0%, #f3ebffd4 21.15%)'
        : 'unset',
    opacity: 0.5,
    width: '392px',
    margin: 'auto',
    transitionProperty: showWelcome && 'opacity',
    transitionDuration: showWelcome && '.3s',
    transitionTimingFunction: showWelcome && 'ease-in-out',
    borderTopRightRadius: '12px',
    borderTopLeftRadius: '12px',
  },

  '& > .onramper-container:before': {
    height: 'calc( 100% - 24px )',
    borderRadius: '12px',
    opacity: 0.25,
  },

  '& > .onramper-container:hover:before': {
    opacity: 0,
    height: '100%',
  },

  '& > div > div:before': {
    top: showWelcome && theme.spacing(6),
    transitionProperty: showWelcome && 'top',
    transitionDuration: showWelcome && '.3s',
    transitionTimingFunction: showWelcome && 'ease-in-out',
  },

  '& > div > div:hover:before': {
    opacity: 0,
    top: showWelcome && 0,
  },

  '& > .widget-wrapper > div, & > .onramper-container': {
    paddingTop: showWelcome && theme.spacing(6),
    // opacity: 1,
  },

  '& > .onramper-container iframe': {
    height: showWelcome && '800px',
  },

  '& > div > div': {
    top: showWelcome && theme.spacing(6),
  },

  '& > div > div, & > .onramper-container': {
    // overflow: showWelcome && 'hidden',
    opacity: showWelcome && 0.75,
    transitionProperty: showWelcome && 'padding-top, opacity, top',
    transitionDuration: showWelcome && '.3s',
    transitionTimingFunction: showWelcome && 'ease-in-out',
  },

  '& > div > div:hover, & > .onramper-container:hover': {
    top: showWelcome && 0,
    paddingTop: showWelcome && theme.spacing(0),
    // opacity: showWelcome && 1,
  },

  '& > .onramper-container:hover': {
    overflow: 'visible',
    top: 'unset',
  },

  '& > div > div:after, & > .onramper-container:after': {
    content: showWelcome && '" "',
    position: 'absolute',
    zIndex: -1,
    opacity: theme.palette.mode === 'dark' ? 0.08 : 0.25,
    pointerEvents: 'none',
    minWidth: '640px',
    minHeight: '640px',
    width: '1080px',
    height: '1080px',
    transform: 'translate(-50%, -75%)',
    left: '50%',
    top: '0%',
    transitionProperty: ' top, opacity, width, height',
    transitionDuration: '.3s',
    transitionTimingFunction: 'ease-in-out',
    background:
      theme.palette.mode === 'dark'
        ? 'radial-gradient(50% 50% at 50% 50%, #6600FF 0%, rgba(255, 255, 255, 0) 100%);'
        : 'radial-gradient(50% 50% at 50% 50%, #8700B8 0%, rgba(255, 255, 255, 0) 100%)',
  },

  // '& > div > div:after, & > .onramper-container:after': {
  //   content: showWelcome && '" "',
  //   position: 'absolute',
  //   zIndex: -1,
  //   opacity: theme.palette.mode === 'dark' ? 0.48 : 0.32,
  //   minWidth: '440px',
  //   minHeight: '440px',
  //   width: '100vw',
  //   height: '100vw',
  //   transform: 'translate(-50%, -50%)',
  //   left: '50%',
  //   top: '50%',
  //   background:
  //     theme.palette.mode === 'dark'
  //       ? 'radial-gradient(50% 50% at 50% 50%, #6600FF 0%, rgba(255, 255, 255, 0) 100%)'
  //       : 'radial-gradient(50% 50% at 50% 50%, #8700B8 0%, rgba(255, 255, 255, 0) 100%)',
  // },

  '& > div > div:hover:after, & > .onramper-container:hover:after': {
    content: showWelcome && '" "',
    position: 'absolute',
    zIndex: -1,
    opacity: theme.palette.mode === 'dark' ? 0.48 : 0.5, //0.48 : 0.32,
    // width: '50vw',
    // height: '50vw',
    top: '150%',
    // bottom: '-4px',
    background:
      theme.palette.mode === 'dark'
        ? 'radial-gradient(50% 50% at 50% 50%, #6600FF 0%, rgba(255, 255, 255, 0) 100%)'
        : 'radial-gradient(50% 50% at 50% 50%, #8700B8 0%, rgba(255, 255, 255, 0) 100%)',
  },
}));
