'use client';

import type { BoxProps, Breakpoint } from '@mui/material';
import { Box, styled } from '@mui/material';
import { HeaderHeight } from 'src/const/headerHeight';
import { DEFAULT_WELCOME_SCREEN_HEIGHT } from '../WelcomeScreen';

const DEFAULT_WIDGET_HEIGHT = 686;
// used on welcome-screen to prepare hover-animation
const DEFAULT_WIDGET_TOP_HOVER_OFFSET = 24;
// mid viewheight - ≈ 2/3 of widget height
const DEFAULT_WIDGET_TOP_OFFSET_VAR = `${DEFAULT_WELCOME_SCREEN_HEIGHT} - ${DEFAULT_WIDGET_HEIGHT}px / 2.75`;
export interface WidgetWrapperProps extends BoxProps {
  welcomeScreenClosed?: boolean;
  autoHeight?: boolean;
}

export const WidgetWrapper = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'welcomeScreenClosed' && prop !== 'autoHeight',
})<WidgetWrapperProps>(({ theme, welcomeScreenClosed, autoHeight }) => {
  // autoHeight is used to adapt widget-height automatically instead of default 686px
  const widgetHeight: 'auto' | number = autoHeight
    ? 'auto'
    : DEFAULT_WIDGET_HEIGHT;

  return {
    width: '100%',
    position: 'relative',
    margin: theme.spacing(0, 'auto'),
    zIndex: 2,
    height: 'auto',
    '& > div:not(.alert)': {
      position: 'relative',
      transitionProperty: 'margin-top',
      transitionDuration: '.3s',
      transitionTimingFunction: 'ease-in-out',
      marginTop: 0,
      maxHeight: '50vh',
      [theme.breakpoints.up('sm' as Breakpoint)]: {
        height: 'auto',
        marginTop: 0,
        [`@media screen and (min-height: 700px)`]: {
          // set default widget height
          height: '50vh',
          marginTop: 0,
        },
        [`@media screen and (min-height: 900px)`]: {
          marginTop: 0,
        },
      },
    },
    // widget overlay while welcome-screen is opened
    '& > div:before': {
      content: '" "',
      // hide overlay while welcome-screen is closed
      visibility: 'hidden',
      position: 'absolute',
      width: 'inherit',
      zIndex: 900,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        theme.palette.mode === 'light'
          ? `linear-gradient(180deg, transparent 15%,  ${theme.palette.white.main} 40%)`
          : `linear-gradient(180deg, transparent 15%,  ${theme.palette.black.main} 40%)`,
      opacity: 0.5,
      margin: 'auto',
      transitionProperty: 'opacity, bottom',
      transitionDuration: '0.3s',
      transitionTimingFunction: 'ease-in-out',
      transitionDelay: '0.3s',
      borderTopRightRadius: '12px',
      borderTopLeftRadius: '12px',
      top: 0,
    },
    // hover animation of widget overlay
    '& > div:hover:before': {
      opacity: 0.25,
      top: DEFAULT_WIDGET_TOP_HOVER_OFFSET,
    },
    variants: [
      {
        props: ({ welcomeScreenClosed }) => !welcomeScreenClosed,
        style: {
          overflow: 'hidden',
          [`@media screen and (min-height: 700px)`]: {
            overflow: 'visible',
          },
        },
      },
      {
        props: ({ welcomeScreenClosed }) => welcomeScreenClosed,
        style: {
          '& > div:not(.alert)': {
            maxHeight: '100%',
          },
        },
      },
      {
        props: ({ welcomeScreenClosed }) => !welcomeScreenClosed,
        style: {
          '& > div:not(.alert)': {
            cursor: 'pointer',
            // add margin-top to widget-wrapper when welcome-screen is closed
            marginTop: DEFAULT_WIDGET_TOP_HOVER_OFFSET,
            '&:hover': {
              // add margin-top to widget-wrapper when welcome-screen is closed
              marginTop: 0,
            },
            // positioning of widget on mobile-screens from 700px height
            [`@media screen and (min-height: 700px)`]: {
              marginTop: `calc( ${DEFAULT_WIDGET_TOP_OFFSET_VAR} - ${HeaderHeight.XS}px )`,
              '&:hover': {
                marginTop: `calc( ${DEFAULT_WIDGET_TOP_OFFSET_VAR} - ${HeaderHeight.XS}px - ${DEFAULT_WIDGET_TOP_HOVER_OFFSET}px )`,
              },
            },
            // positioning of widget on mobile-screens from 900px height
            [`@media screen and (min-height: 900px)`]: {
              marginTop: `calc( ${DEFAULT_WIDGET_TOP_OFFSET_VAR} - ${HeaderHeight.MD}px)`,
              '&:hover': {
                marginTop: `calc( ${DEFAULT_WIDGET_TOP_OFFSET_VAR} - ${HeaderHeight.MD}px - ${DEFAULT_WIDGET_TOP_HOVER_OFFSET}px )`,
              },
            },
          },
        },
      },
      {
        props: ({ welcomeScreenClosed }) => !welcomeScreenClosed,
        style: {
          '& > div:not(.alert)': {
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              marginTop: DEFAULT_WIDGET_TOP_OFFSET_VAR,
            },
          },
        },
      },
      {
        props: ({ welcomeScreenClosed }) => welcomeScreenClosed,
        style: {
          '& > div:not(.alert)': {
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              [`@media screen and (min-height: 700px)`]: {
                height: widgetHeight,
              },
            },
          },
        },
      },
      {
        props: ({ welcomeScreenClosed }) => !welcomeScreenClosed,
        style: {
          '& > div:not(.alert)': {
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              [`@media screen and (min-height: 700px)`]: {
                // (mid viewheight - ≈ 2/3 of widget height - navbar height )
                marginTop: `calc( ${DEFAULT_WIDGET_TOP_OFFSET_VAR} - 40px )`,
              },
            },
          },
        },
      },
      {
        props: ({ welcomeScreenClosed }) => !welcomeScreenClosed,
        style: {
          '& > div:not(.alert)': {
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              [`@media screen and (min-height: 900px)`]: {
                // (mid viewheight - ≈ 2/3 of widget height - ( navbar height + additional spacing) )
                marginTop: `calc( ${DEFAULT_WIDGET_TOP_OFFSET_VAR} - ${HeaderHeight.MD}px )`,
              },
            },
          },
        },
      },
      {
        props: ({ welcomeScreenClosed }) => !welcomeScreenClosed,
        style: {
          '& > div:before': {
            visibility: 'visible',
          },
        },
      },
    ],
  };
});
