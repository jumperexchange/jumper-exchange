import type { Breakpoint } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { HeaderHeight } from 'src/const/headerHeight';
import { DEFAULT_WELCOME_SCREEN_HEIGHTS } from '@/components/WelcomeScreen/WelcomeScreen.style';

export const DEFAULT_WIDGET_HEIGHT = 686;
export const DEFAULT_WIDGET_TOP_HOVER_OFFSET = 24;
export const DEFAULT_WIDGET_TOP_OFFSET_VARS = {
  xs: `${DEFAULT_WELCOME_SCREEN_HEIGHTS.xs} - ${DEFAULT_WIDGET_HEIGHT}px / 2`,
  md: `${DEFAULT_WELCOME_SCREEN_HEIGHTS.md} - ${DEFAULT_WIDGET_HEIGHT}px / 2.75`,
} as const;

const WELCOME_SCREEN_MARGIN_TRANSITION = {
  transitionProperty: 'margin-top',
  transitionDuration: '.3s',
  transitionTimingFunction: 'ease-in-out',
} as const;

export const getWelcomeScreenMarginSx = (
  welcomeScreenClosed: boolean,
): SxProps<Theme> => {
  if (welcomeScreenClosed) {
    return {
      ...WELCOME_SCREEN_MARGIN_TRANSITION,
      marginTop: 0,
      justifyContent: 'flex-start',
    };
  }

  return (theme) => ({
    ...WELCOME_SCREEN_MARGIN_TRANSITION,
    justifyContent: 'center',
    marginTop: `calc(${DEFAULT_WIDGET_TOP_OFFSET_VARS.xs})`,
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      marginTop: `calc(${DEFAULT_WIDGET_TOP_OFFSET_VARS.md})`,
      [`@media screen and (min-height: 700px)`]: {
        marginTop: `calc( ${DEFAULT_WIDGET_TOP_OFFSET_VARS.md} - 40px )`,
      },
      [`@media screen and (min-height: 900px)`]: {
        marginTop: `calc( ${DEFAULT_WIDGET_TOP_OFFSET_VARS.md} - ${HeaderHeight.MD}px )`,
      },
    },
    [`@media screen and (min-height: 700px)`]: {
      marginTop: `calc( ${DEFAULT_WIDGET_TOP_OFFSET_VARS.xs} - ${HeaderHeight.XS}px )`,
    },
    [`@media screen and (min-height: 900px)`]: {
      marginTop: `calc( ${DEFAULT_WIDGET_TOP_OFFSET_VARS.md} - ${HeaderHeight.MD}px)`,
    },
  });
};
