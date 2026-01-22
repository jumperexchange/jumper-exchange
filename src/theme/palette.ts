import { alpha } from '@mui/material/styles';
import type { BaseColors } from './baseColors';
import { baseColors as defaultBaseColors } from './baseColors';

export const createPalette = (
  paletteLight: ReturnType<typeof import('./paletteLight').createPaletteLight>,
  baseColors: BaseColors = defaultBaseColors,
) => ({
  ...paletteLight,
  ...baseColors,
  background: {
    default: paletteLight.lavenderLight[0],
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
});
