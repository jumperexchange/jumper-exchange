'use client';

import type { Breakpoint } from '@mui/material';
import { Box, alpha, styled } from '@mui/material';
import Image from 'next/image';

export interface WidgetContainerProps {
  welcomeScreenClosed: boolean;
}

export const WidgetContainer = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'isActive' && prop !== 'welcomeScreenClosed',
})<WidgetContainerProps>(({ theme, welcomeScreenClosed }) => ({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'inherit',
  width: '100%',
  minHeight: '50vh',
  transitionProperty: 'max-height',
  transitionDuration: '.3s',
  transitionTimingFunction: 'ease-in-out',
  maxHeight: !welcomeScreenClosed ? '50vh' : 'inherit',

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    width: 'auto',
  },

  [theme.breakpoints.up('lg' as Breakpoint)]: {
    margin: theme.spacing(0, 4),
    ...(welcomeScreenClosed && {
      marginRight: `calc( ${theme.spacing(4)} + 56px )`,
    }),
  },

  // radial shadow glow -> animation
  '&:hover:after': {
    ...(!welcomeScreenClosed && {
      opacity: theme.palette.mode === 'dark' ? 0.48 : 0.34,
      top: '55%',
    }),
  },

  // setting hover animations on widget wrappers
  '& > .widget-wrapper > div': {
    transitionProperty: 'margin-top',
    transitionDuration: '.3s',
    transitionTimingFunction: 'ease-in-out',
    ...(welcomeScreenClosed && { marginTop: 0 }),
    cursor: !welcomeScreenClosed ? 'pointer' : 'auto',
    [theme.breakpoints.down('sm' as Breakpoint)]: {
      height: 'auto',
      div: {
        maxHeight: '100%',
      },
    },

    [theme.breakpoints.up('sm' as Breakpoint)]: {
      marginTop: !welcomeScreenClosed ? '24px' : 0,
      [`@media screen and (min-height: 700px)`]: {
        marginTop: !welcomeScreenClosed
          ? 'calc( 50vh - 680px / 2.75 - 40px)'
          : 0, // (mid viewheight - half-two/thirds widget height - navbar height )
      },

      [`@media screen and (min-height: 900px)`]: {
        marginTop: !welcomeScreenClosed
          ? 'calc( 50vh - 680px / 2.75 - 128px)'
          : 0, // (mid viewheight - half-two/thirds widget height - ( navbar height + additional spacing) )
      },
    },
  },

  '.welcome-screen-container + & .widget-wrapper > div': {
    cursor: 'pointer',
  },

  // // TODO move to welcome screen component
  '.welcome-screen-container + &': {
    maxHeight: !welcomeScreenClosed ? '50vh' : 'auto',
  },

  // radial shadow glow
  '&:after': {
    content: '" "',
    visibility: !welcomeScreenClosed ? 'visible' : 'hidden',
    transitionProperty: 'top, opacity',
    transitionDuration: '.4s',
    transitionTimingFunction: 'ease-in-out',
    background:
      theme.palette.mode === 'dark'
        ? 'radial-gradient(50% 50% at 50% 50%, #6600FF 0%, rgba(255, 255, 255, 0) 100%);'
        : 'radial-gradient(50% 50% at 50% 50%, #8700B8 0%, rgba(255, 255, 255, 0) 100%);',
    zIndex: -1,
    pointerEvents: 'none',
    width: 1080,
    height: 1080,
    position: 'fixed',
    maxWidth: 'calc( 416px * 2 )',
    maxHeight: 'calc( 416px * 2 )',
    transform: 'translate(-50%, -50%)',
    left: '50%',
    top: '50%',
    opacity:
      !welcomeScreenClosed && theme.palette.mode === 'dark'
        ? 0.24
        : !welcomeScreenClosed && theme.palette.mode === 'light'
          ? 0.12
          : 0,
    [theme.breakpoints.up('lg' as Breakpoint)]: {
      maxWidth: '90vh',
      maxHeight: '90vh',
    },
  },
}));

export const BackgroundFooterImage = styled(Image)(({ theme }) => ({
  width: 200,
  height: 'auto',
  bottom: 0,
  objectFit: 'contain',
  left: 0,
  cursor: 'pointer',
  margin: theme.spacing(2),
  transition: 'background-color 0.3s ease-in',
  borderRadius: '12px',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(4),
    width: 400,
    height: 'auto',
  },

  '&:hover': {
    backgroundColor: alpha(theme.palette.black.main, 0.04),
  },
}));
