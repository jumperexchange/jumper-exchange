import type { Appearance, WidgetConfig } from '@lifi/widget';
import { type Breakpoint, type Theme } from '@mui/material';
import { DefaultColorScheme } from 'node_modules/@mui/material/esm/styles/createThemeWithVars';
import { themeCustomized } from 'src/theme/theme';

// INFO: Do NOT use theme.vars here, it will break the widget
export const getDefaultWidgetTheme = (
  theme: Theme,
): { config: Partial<WidgetConfig> } => {
  return {
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
  };
};

// INFO: Do NOT use theme.vars here, it will break the widget
export const getDefaultWidgetThemeV2 = (
  mode: DefaultColorScheme,
): { config: Partial<WidgetConfig> } => {
  if (themeCustomized.colorSchemes[mode] === undefined) {
    throw new Error(`Theme mode "${mode}" is not defined in the theme.`);
  }

  const copiedTheme = {...themeCustomized };

  copiedTheme.colorSchemes.dark.palette.grey[800] = '#302b52';

  const config = {
    config: {
      appearance: mode as Appearance,
      theme: {
        // @ts-ignore
        typography: {
          fontFamily: copiedTheme.typography.fontFamily,
        },
        header: {
          overflow: 'visible',
        },
        container: {
          borderRadius: '12px',
          maxWidth: '100%',
          [copiedTheme.breakpoints.up('sm' as Breakpoint)]: {
            borderRadius: '12px',
            maxWidth: 416,
            minWidth: 416,
            boxShadow: copiedTheme.shadows[1],
          },
        },
        shape: {
          borderRadius: 12,
          borderRadiusSecondary: 24,
        },
        colorScheme: copiedTheme.colorSchemes,
      },
    },
  };

  return config;
};
