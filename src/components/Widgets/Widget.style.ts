'use client';

import type { BoxProps, Breakpoint } from '@mui/material';
import { Box, styled } from '@mui/material';
import { HeaderHeight } from 'src/const/headerHeight';
import {
  DEFAULT_WIDGET_HEIGHT,
  DEFAULT_WIDGET_TOP_HOVER_OFFSET,
  DEFAULT_WIDGET_TOP_OFFSET_VARS,
} from './widgetWelcomeScreenMargins';

export interface WidgetWrapperProps extends BoxProps {
  welcomeScreenClosed?: boolean;
  autoHeight?: boolean;
  contributionDisplayed?: boolean;
}

export const WidgetWrapper = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'welcomeScreenClosed' &&
    prop !== 'autoHeight' &&
    prop !== 'contributionDisplayed',
})<WidgetWrapperProps>(({ theme, autoHeight, contributionDisplayed }) => {
  const widgetHeight: 'auto' | number = autoHeight
    ? 'auto'
    : DEFAULT_WIDGET_HEIGHT;

  return {
    width: '100%',
    position: 'relative',
    margin: theme.spacing(0, 'auto'),
    zIndex: 2,
    display: 'contents',
    '& > div:not(.alert)': {
      position: 'relative',
      transitionProperty: 'margin-top',
      transitionDuration: '.3s',
      transitionTimingFunction: 'ease-in-out',
      marginTop: 0,
      [theme.breakpoints.up('sm' as Breakpoint)]: {
        marginTop: 0,
        [`@media screen and (min-height: 700px)`]: {
          // set default widget height
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
      background: `linear-gradient(180deg, transparent 15%,  ${(theme.vars || theme).palette.black.main} 40%)`,
      opacity: 0.5,
      margin: 'auto',
      transitionProperty: 'opacity, bottom',
      transitionDuration: '0.3s',
      transitionTimingFunction: 'ease-in-out',
      transitionDelay: '0.3s',
      borderTopRightRadius: '12px',
      borderTopLeftRadius: '12px',
      top: 0,
      ...theme.applyStyles('light', {
        background: `linear-gradient(180deg, transparent 15%,  ${(theme.vars || theme).palette.white.main} 40%)`,
      }),
    },
    // hover animation of widget overlay
    '& > div:hover:before': {
      opacity: 0.25,
      top: DEFAULT_WIDGET_TOP_HOVER_OFFSET,
    },
    ...(contributionDisplayed && {
      // Target the widget-relative-container element used for the FeeContribution component
      '& [id^="widget-relative-container-"]': {
        height: '600px',
      },
    }),
    '& [id^="widget-scrollable-container-"]:has(.long-list)': {
      height: widgetHeight,
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
        props: ({ welcomeScreenClosed }) => !welcomeScreenClosed,
        style: {
          '& > div:not(.alert)': {
            cursor: 'pointer',
            marginTop: DEFAULT_WIDGET_TOP_HOVER_OFFSET,
            '&:hover': {
              marginTop: 0,
            },
            [`@media screen and (min-height: 700px)`]: {
              marginTop: `calc( ${DEFAULT_WIDGET_TOP_OFFSET_VARS.xs} - ${HeaderHeight.XS}px )`,
              '&:hover': {
                marginTop: `calc( ${DEFAULT_WIDGET_TOP_OFFSET_VARS.xs} - ${HeaderHeight.XS}px - ${DEFAULT_WIDGET_TOP_HOVER_OFFSET}px )`,
              },
            },
            [`@media screen and (min-height: 900px)`]: {
              marginTop: `calc( ${DEFAULT_WIDGET_TOP_OFFSET_VARS.md} - ${HeaderHeight.MD}px)`,
              '&:hover': {
                marginTop: `calc( ${DEFAULT_WIDGET_TOP_OFFSET_VARS.md} - ${HeaderHeight.MD}px - ${DEFAULT_WIDGET_TOP_HOVER_OFFSET}px )`,
              },
            },
          },
        },
      },
      {
        props: ({ welcomeScreenClosed }) => !welcomeScreenClosed,
        style: {
          '& > div:not(.alert)': {
            marginTop: DEFAULT_WIDGET_TOP_OFFSET_VARS.xs,
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              marginTop: DEFAULT_WIDGET_TOP_OFFSET_VARS.md,
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
                marginTop: `calc( ${DEFAULT_WIDGET_TOP_OFFSET_VARS.md} - 40px )`,
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
                marginTop: `calc( ${DEFAULT_WIDGET_TOP_OFFSET_VARS.md} - ${HeaderHeight.MD}px )`,
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
