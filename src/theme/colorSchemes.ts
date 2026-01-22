import type { Theme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import { baseColors } from './baseColors';
import type { createPaletteDark } from './paletteDark';
import type { createPaletteLight } from './paletteLight';

export const createColorSchemes = (
  themeBase: Theme,
  paletteLight: ReturnType<typeof createPaletteLight>,
  paletteDark: ReturnType<typeof createPaletteDark>,
) => ({
  light: {
    palette: {
      ...paletteLight,
      semanticPalette: paletteLight,
      mode: 'light' as const,
      background: {
        default: paletteLight.surface2,
        paper: paletteLight.surface1,
      },
      text: {
        primary: paletteLight.textPrimary,
        secondary: paletteLight.textSecondary,
        disabled: paletteLight.textDisabled,
      },
      grey: {
        100: paletteLight.alpha100.main,
        200: paletteLight.alpha200.main,
        300: paletteLight.alpha300.main,
        400: paletteLight.alpha400.main,
        500: paletteLight.alpha500.main,
        600: paletteLight.alpha600.main,
        700: paletteLight.alpha700.main,
        800: paletteLight.alpha800.main,
        900: paletteLight.alpha900.main,
      },
      bg: {
        main: paletteLight.bg,
      },
      bgSecondary: {
        main: alpha(baseColors.white.main, 0.48),
      },
      bgTertiary: {
        main: baseColors.white.main,
      },
      bgQuaternary: {
        hover: alpha('#653BA3', 0.12),
        main: alpha('#31007A', 0.08),
      },
      primary: {
        light: '#31007A',
        main: '#31007A',
        dark: '#290066',
      },
      secondary: {
        light: '#E9E1F5',
        main: '#E9E1F5',
        dark: '#E9E1F5',
      },
      tertiary: {
        light: '#FCEBFF',
        main: '#FCEBFF',
        dark: '#FCEBFF',
      },
      accent1: {
        light: paletteLight.accent1,
        main: paletteLight.accent1,
        dark: paletteLight.accent1,
      },
      accent1Alt: {
        light: paletteLight.accent1Alt,
        main: paletteLight.accent1Alt,
        dark: paletteLight.accent1Alt,
      },
      accent2: {
        light: paletteLight.accent2,
        main: paletteLight.accent2,
        dark: paletteLight.accent2,
      },
      surface1: {
        light: paletteLight.surface1,
        main: paletteLight.surface1,
        dark: paletteLight.surface1,
      },
      surface2: {
        light: paletteLight.surface2,
        main: paletteLight.surface2,
        dark: paletteLight.surface2,
      },
      surface3: {
        light: paletteLight.surface3,
        main: paletteLight.surface3,
        dark: paletteLight.surface3,
      },
      surface4: {
        light: paletteLight.surface4,
        main: paletteLight.surface4,
        dark: paletteLight.surface4,
      },
    },
    shadows: [
      'none',
      '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)',
      '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
      '0px 4px 24px 0px rgba(0, 0, 0, 0.08)',
      ...themeBase.shadows.slice(3),
    ] as Theme['shadows'],
  },
  dark: {
    palette: {
      ...paletteDark,
      semanticPalette: paletteDark,
      mode: 'dark' as const,
      Tooltip: {
        bg: baseColors.black.main,
      },
      background: {
        default: paletteDark.surface2,
        paper: paletteDark.surface1,
      },
      text: {
        primary: baseColors.white.main,
        secondary: alpha(baseColors.white.main, 0.75),
      },
      grey: {
        100: paletteDark.alpha100.main,
        200: paletteDark.alpha200.main,
        300: paletteDark.alpha300.main,
        400: paletteDark.alpha400.main,
        500: paletteDark.alpha500.main,
        600: paletteDark.alpha600.main,
        700: paletteDark.alpha700.main,
        800: paletteDark.alpha800.main,
        900: paletteDark.alpha900.main,
      },
      bg: {
        main: paletteDark.bg,
      },
      bgSecondary: {
        main: alpha(baseColors.white.main, 0.12),
      },
      bgTertiary: {
        main: baseColors.alphaLight200.main,
      },
      bgQuaternary: {
        hover: alpha('#653BA3', 0.56),
        main: alpha('#653BA3', 0.42),
      },
      primary: {
        light: paletteDark.accent1,
        main: paletteDark.accent1,
        dark: paletteDark.accent1,
      },
      secondary: {
        light: paletteDark.accent2,
        main: paletteDark.accent2,
        dark: paletteDark.accent2,
      },
      tertiary: {
        light: '#33163D',
        main: '#33163D',
        dark: '#33163D',
      },
      accent1: {
        light: paletteDark.accent1,
        main: paletteDark.accent1,
        dark: paletteDark.accent1,
      },
      accent1Alt: {
        light: paletteDark.accent1Alt,
        main: paletteDark.accent1Alt,
        dark: paletteDark.accent1Alt,
      },
      accent2: {
        light: paletteDark.accent2,
        main: paletteDark.accent2,
        dark: paletteDark.accent2,
      },
      surface1: {
        light: paletteDark.surface1,
        main: paletteDark.surface1,
        dark: paletteDark.surface1,
      },
      surface2: {
        light: paletteDark.surface2,
        main: paletteDark.surface2,
        dark: paletteDark.surface2,
      },
      surface3: {
        light: paletteDark.surface3,
        main: paletteDark.surface3,
        dark: paletteDark.surface3,
      },
      surface4: {
        light: paletteDark.surface4,
        main: paletteDark.surface4,
        dark: paletteDark.surface4,
      },
    },
    shadows: [
      'none',
      '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
      '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
      '0px 4px 24px 0px rgba(0, 0, 0, 0.08)',
      ...themeBase.shadows.slice(3),
    ] as Theme['shadows'],
  },
});
