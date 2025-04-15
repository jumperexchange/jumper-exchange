import type { WidgetConfig } from '@lifi/widget';
import type { Breakpoint, Theme } from '@mui/material';
import { themeCustomized } from 'src/theme/theme';


// INFO: Do NOT use theme.vars here, it will break the widget
export const getDefaultWidgetTheme = (
  theme: Theme,
): { config: Partial<WidgetConfig> } => {
  console.log('widgettt', theme)
  return ({
  config: {
    appearance: theme.palette.mode,
    theme: {
      // @ts-ignore
      typography: {
        fontFamily: theme.typography.fontFamily,
      },
      header: {
        overflow: 'visible',
      },
      container: {
        borderRadius: '12px',
        maxWidth: '100%',
        [theme.breakpoints.up('sm' as Breakpoint)]: {
          borderRadius: '12px',
          maxWidth: 416,
          minWidth: 416,
          boxShadow: theme.shadows[1],
        },
      },
      shape: {
        borderRadius: 12,
        borderRadiusSecondary: 24,
      },
      palette: {
        background: {
          paper: theme.palette.surface2.main,
          default: theme.palette.surface1.main,
        },
        primary: {
          main: theme.palette.accent1.main,
        },
        secondary: {
          main: theme.palette.accent2.main,
        },
        grey: theme.palette.grey,
      },
    },
  },
})
};

// INFO: Do NOT use theme.vars here, it will break the widget
export const getDefaultWidgetThemeV2 = (
  mode,
): { config: Partial<WidgetConfig> } => {
  console.log('widgettt', mode)
  return ({
  config: {
    appearance: mode,
    theme: {
      // @ts-ignore
      typography: {
        fontFamily: themeCustomized.typography.fontFamily,
      },
      header: {
        overflow: 'visible',
      },
      container: {
        borderRadius: '12px',
        maxWidth: '100%',
        [themeCustomized.breakpoints.up('sm' as Breakpoint)]: {
          borderRadius: '12px',
          maxWidth: 416,
          minWidth: 416,
          boxShadow: themeCustomized.shadows[1],
        },
      },
      shape: {
        borderRadius: 12,
        borderRadiusSecondary: 24,
      },
      palette: {
        background: {
          paper: themeCustomized.colorSchemes[mode].palette.surface2.main,
          default: themeCustomized.colorSchemes[mode].palette.surface1.main,
        },
        primary: {
          main: themeCustomized.colorSchemes[mode].palette.accent1.main,
        },
        secondary: {
          main: themeCustomized.colorSchemes[mode].palette.accent2.main,
        },
        grey: {
          ...themeCustomized.colorSchemes[mode].palette.grey,
          // TODO: Fix it later
          [800]: mode === 'dark' ? '#302b52' : themeCustomized.colorSchemes[mode].palette.grey[800],
        }
      },
    },
  },
})
};
