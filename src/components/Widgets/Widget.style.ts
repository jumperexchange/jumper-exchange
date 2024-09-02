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
  ...(!welcomeScreenClosed && {
    '&:hover': {
      marginTop: 0,
    },
  }),
  zIndex: 2,

  '> div': {
    transitionProperty: 'margin-top',
    transitionDuration: '.3s',
    transitionTimingFunction: 'ease-in-out',
    marginTop: !welcomeScreenClosed ? '24px' : 0,
    cursor: !welcomeScreenClosed ? 'pointer' : 'auto',

    ...(!welcomeScreenClosed && {
      [`@media screen and (min-height: 700px)`]: {
        marginTop: 'calc( 50vh - 680px / 2.75 - 40px - 24px )',
        '&:hover': {
          marginTop: 'calc( 50vh - 680px / 2.75 - 40px - 48px )',
        },
      },

      [`@media screen and (min-height: 900px)`]: {
        marginTop: 'calc( 50vh - 680px / 2.75 - 104px - 24px)',
        // '&:hover': {
        //   marginTop: 'calc( 50vh - 680px / 2.75 - 104px - 48px)',
        // },
      },
    }),

    [theme.breakpoints.down('sm' as Breakpoint)]: {
      height: 'auto',
      div: {
        maxHeight: '100%',
      },
    },

    [theme.breakpoints.up('sm' as Breakpoint)]: {
      marginTop: !welcomeScreenClosed ? '24px' : theme.spacing(3.5),
      [`@media screen and (min-height: 700px)`]: {
        marginTop: !welcomeScreenClosed
          ? 'calc( 50vh - 680px / 2.75 - 40px)'
          : theme.spacing(3.5), // (mid viewheight - half-two/thirds widget height - navbar height )
      },

      [`@media screen and (min-height: 900px)`]: {
        marginTop: !welcomeScreenClosed
          ? 'calc( 50vh - 680px / 2.75 - 128px)'
          : theme.spacing(3.5), // (mid viewheight - half-two/thirds widget height - ( navbar height + additional spacing) )
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
    background:
      theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, transparent 15%,  #000 40%)'
        : 'linear-gradient(180deg, transparent 15%, #fff 40%)',
    opacity: 0.5,
    margin: 'auto',
    transitionProperty: 'opacity, bottom',
    transitionDuration: '0.3s',
    transitionTimingFunction: 'ease-in-out',
    transitionDelay: !welcomeScreenClosed ? '0s' : '0.3s',
    borderTopRightRadius: '12px',
    borderTopLeftRadius: '12px',
    top: 24,

    [`@media screen and (min-height: 700px)`]: {
      top: welcomeScreenClosed ? 'calc( 50vh - 680px / 2.75 - 40px)' : '200%', // (mid viewheight - half-two/thirds widget height - navbar height )
    },

    [`@media screen and (min-height: 900px)`]: {
      top: !welcomeScreenClosed ? '200%' : 'calc( 50vh - 680px / 2.75 - 128px)', // (mid viewheight - half-two/thirds widget height - ( navbar height + additional spacing) )
      // bottom: !welcomeScreenClosed ? 0 : 'calc( 680px - 486px )',
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
