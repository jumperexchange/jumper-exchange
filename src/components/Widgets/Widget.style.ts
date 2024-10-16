'use client';

import type { BoxProps, Breakpoint } from '@mui/material';
import { Box, styled } from '@mui/material';

export interface WidgetWrapperProps extends Omit<BoxProps, 'component'> {
  welcomeScreenClosed?: boolean;
}

export const WidgetWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'welcomeScreenClosed',
})<WidgetWrapperProps>(({ theme, welcomeScreenClosed }) => ({
  width: '100%',
  position: 'relative',
  margin: theme.spacing(0, 'auto'),
  zIndex: 2,
  ...(!welcomeScreenClosed && { overflow: 'hidden' }),

  '> div': {
    transitionProperty: 'margin-top',
    transitionDuration: '.3s',
    transitionTimingFunction: 'ease-in-out',
    marginTop: 0,
    cursor: !welcomeScreenClosed ? 'pointer' : 'auto',
    maxHeight: '100%', //

    ...(!welcomeScreenClosed && {
      marginTop: !welcomeScreenClosed ? '24px' : 0,

      '&:hover': {
        marginTop: 0,
      },
      [`@media screen and (min-height: 700px)`]: {
        marginTop: 'calc( 50vh - 680px / 2.75 - 40px - 24px )',
        '&:hover': {
          marginTop: 'calc( 50vh - 680px / 2.75 - 40px - 48px )',
        },
      },
      [`@media screen and (min-height: 900px)`]: {
        marginTop: 'calc( 50vh - 680px / 2.75 - 104px - 24px)',
        '&:hover': {
          marginTop: 'calc( 50vh - 680px / 2.75 - 104px - 48px)',
        },
      },
    }),

    [theme.breakpoints.down('sm' as Breakpoint)]: {
      height: 'auto',
      div: {
        maxHeight: '100%',
      },
    },

    [theme.breakpoints.up('sm' as Breakpoint)]: {
      height: 'auto',
      marginTop: !welcomeScreenClosed ? '24px' : theme.spacing(3.5),
      [`@media screen and (min-height: 700px)`]: {
        marginTop: !welcomeScreenClosed
          ? 'calc( 50vh - 680px / 2.75 - 40px)' // (mid viewheight - half-two/thirds widget height - navbar height )
          : theme.spacing(3.5),
      },

      [`@media screen and (min-height: 900px)`]: {
        marginTop: !welcomeScreenClosed
          ? 'calc( 50vh - 680px / 2.75 - 128px)' // (mid viewheight - half-two/thirds widget height - ( navbar height + additional spacing) )
          : theme.spacing(3.5),
      },
    },
  },

  // widget overlay when welcome screen opened
  '> div:before': {
    content: '" "',
    visibility: !welcomeScreenClosed ? 'visible' : 'hidden',
    position: 'absolute',
    width: 'inherit',
    zIndex: 900,
    left: 0,
    right: 0,
    bottom: !welcomeScreenClosed ? 0 : 'calc( 680px - 486px )',
    background: `linear-gradient(180deg, transparent 15%,  ${theme.palette.mode === 'dark' ? theme.palette.black.main : theme.palette.white.main} 40%)`,
    opacity: 0.5,
    margin: 'auto',
    transitionProperty: 'opacity, bottom',
    transitionDuration: '0.3s',
    transitionTimingFunction: 'ease-in-out',
    transitionDelay: !welcomeScreenClosed ? '0s' : '0.3s',
    borderTopRightRadius: '12px',
    borderTopLeftRadius: '12px',
    top: 24,
    height: '100%',

    [`@media screen and (min-height: 700px)`]: {
      top: 'calc( 50vh - 680px / 2.75 - 40px)', // (mid viewheight - half-two/thirds widget height - navbar height )
    },

    [`@media screen and (min-height: 900px)`]: {
      top: 'calc( 50vh - 680px / 2.75 - 128px)', // (mid viewheight - half-two/thirds widget height - ( navbar height + additional spacing) )
    },
  },

  // dark widget overlay when welcome screen opened -> hover animation
  '> div:hover:before': {
    opacity: 0.25,
  },
}));

export const GlowBackground = styled('span')(({ theme }) => ({
  position: 'absolute',
  opacity: 0,
  zIndex: -1,
  minWidth: 440,
  minHeight: 440,
  width: '50vw',
  height: '50vw',
  transform: 'translateX(-50%)',
  left: '50%',
  top: 80,
}));
