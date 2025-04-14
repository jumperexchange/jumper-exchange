import type { WidgetConfig } from '@lifi/widget';
import type { Breakpoint, Theme } from '@mui/material';

export const getDefaultWidgetTheme = (
  theme: Theme,
): { config: Partial<WidgetConfig> } => {
  console.log('themew', theme)
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
          paper: theme.vars.palette.surface2.main,
          default: theme.vars.palette.surface1.main,
        },
        primary: {
          main: theme.vars.palette.accent1.main,
        },
        secondary: {
          main: theme.vars.palette.accent2.main,
        },
        grey: theme.vars.palette.grey,
      },
    },
  },
})
};
