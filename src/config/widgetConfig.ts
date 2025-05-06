import type { Appearance, WidgetConfig } from '@lifi/widget';
import {
  ColorSystem,
  CssVarsTheme,
  Palette,
  PaletteMode,
  type Breakpoint,
  type Theme,
} from '@mui/material';
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
  mode: PaletteMode,
): { config: Partial<WidgetConfig> } => {
  if (!themeCustomized.colorSchemes[mode]) {
    throw new Error(`Theme mode "${mode}" is not defined in the theme.`);
  }

  const copiedTheme: Omit<Theme, 'applyStyles'> & CssVarsTheme = {
    ...themeCustomized,
  };

  if (!copiedTheme.colorSchemes.dark) {
    copiedTheme.colorSchemes.dark = {} as NonNullable<
      typeof copiedTheme.colorSchemes.dark
    >;
  }
  if (!copiedTheme.colorSchemes.dark.palette) {
    copiedTheme.colorSchemes.dark.palette = {} as NonNullable<
      typeof copiedTheme.colorSchemes.dark.palette
    >;
  }
  if (!copiedTheme.colorSchemes.dark.palette.grey) {
    copiedTheme.colorSchemes.dark.palette.grey = {} as NonNullable<
      typeof copiedTheme.colorSchemes.dark.palette.grey
    >;
  }
  copiedTheme.colorSchemes.dark.palette.grey[800] = '#302b52';

  const config = {
    config: {
      theme: {
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
        colorSchemes: {
          light: {
            ...copiedTheme.colorSchemes.light,
            palette: formatWidgetPalette(copiedTheme.colorSchemes.light),

          },
          dark: {
            ...copiedTheme.colorSchemes.dark,
            palette: formatWidgetPalette(copiedTheme.colorSchemes.dark),
          },
        },
      },
    },
  };

  // @ts-ignore
  return config;
};

function formatWidgetPalette(colorScheme?: ColorSystem): Partial<Palette> {
  if (!colorScheme) {
    return {};
  }

  return {
    background: {
      paper: colorScheme.palette.surface2.main,
      default: colorScheme.palette.surface1.main,
    },
    primary: colorScheme.palette.accent1,
    secondary: colorScheme.palette.accent2,
    grey: colorScheme.palette.grey,
  };
}
