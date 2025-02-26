'use client';

import type { Breakpoint } from '@mui/material';
import { Box, alpha, styled } from '@mui/material';
import Image from 'next/image';
import { DEFAULT_WELCOME_SCREEN_HEIGHT } from '../WelcomeScreen';

const GLOW_EFFECT_TOP_POSITION = '50%';
const GLOW_EFFECT_TOP_OFFSET_POSITION = '5%';

export interface WidgetContainerProps {
  welcomeScreenClosed: boolean;
}

export const WidgetContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'welcomeScreenClosed',
})<WidgetContainerProps>(({ theme, welcomeScreenClosed }) => {
  let opacity = 0;
  if (!welcomeScreenClosed && theme.palette.mode === 'dark') {
    opacity = 0.24;
  } else if (!welcomeScreenClosed && theme.palette.mode === 'light') {
    opacity = 0.12;
  }

  return {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'inherit',
    width: '100%',
    transitionProperty: 'max-height',
    transitionDuration: '.3s',
    transitionTimingFunction: 'ease-in-out',
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      width: 'auto',
    },
    [theme.breakpoints.up('lg' as Breakpoint)]: {
      margin: theme.spacing(0, 4),
    },
    // default radial shadow glow for a "spot-light" effect
    '&:after': {
      content: '" "',
      visibility: 'hidden',
      transitionProperty: 'top, opacity',
      transitionDuration: '.4s',
      transitionTimingFunction: 'ease-in-out',
      background:
        theme.palette.mode === 'light'
          ? 'radial-gradient(50% 50% at 50% 50%, #8700B8 0%, rgba(255, 255, 255, 0) 100%);'
          : 'radial-gradient(50% 50% at 50% 50%, #6600FF 0%, rgba(255, 255, 255, 0) 100%);',
      zIndex: -1,
      pointerEvents: 'none',
      width: 1080,
      height: 1080,
      position: 'fixed',
      // double-size of widget width
      maxWidth: 'calc( 416px * 2 )',
      // double-size of widget width used to make it a circle-ish glow
      maxHeight: 'calc( 416px * 2 )',
      transform: 'translate(-50%, -50%)',
      left: '50%',
      // default top position of glow-effect
      top: GLOW_EFFECT_TOP_POSITION,
      opacity,
      [theme.breakpoints.up('lg' as Breakpoint)]: {
        // using vh here as well to make it a circle-ish glow
        maxWidth: '90vh',
        maxHeight: '90vh',
      },
    },
    // radial shadow glow -> hover
    '&:hover:after': {},
    variants: [
      {
        props: ({ welcomeScreenClosed }) => !welcomeScreenClosed,
        style: {
          minHeight: DEFAULT_WELCOME_SCREEN_HEIGHT,
          maxHeight: DEFAULT_WELCOME_SCREEN_HEIGHT,
        },
      },
      {
        props: ({ welcomeScreenClosed }) => welcomeScreenClosed,
        style: {
          [theme.breakpoints.up('lg' as Breakpoint)]: {
            // extra marginRight-spacing of 56px (width of navbar-tabs + gap) needed to center properly while welcome-screen is closed
            marginRight: `calc( ${theme.spacing(4)} + 56px )`,
          },
        },
      },
      {
        props: ({ welcomeScreenClosed }) => !welcomeScreenClosed,
        style: {
          '&:after': {
            visibility: 'visible',
          },
        },
      },
      {
        props: ({ welcomeScreenClosed }) => !welcomeScreenClosed,
        style: {
          '&:hover:after': {
            opacity: theme.palette.mode === 'light' ? 0.34 : 0.48,
            // adjusting top position of glow-effect while hovering for "spot-light" effect
            top: `calc( ${GLOW_EFFECT_TOP_POSITION} + ${GLOW_EFFECT_TOP_OFFSET_POSITION})`,
          },
        },
      },
    ],
  };
});

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
