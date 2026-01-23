'use client';
import type { Components, CssVarsTheme } from '@mui/material';
import type { Shape, Theme } from '@mui/material/styles';
import { createTheme, extendTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

import './theme.types';

import type { BaseColors } from './baseColors';
import { baseColors as defaultBaseColors } from './baseColors';
import type { BrandColors } from './brandColors';
import { defaultBrandColors } from './brandColors';
import { createColorSchemes } from './colorSchemes';
import { createComponents } from './components';
import { createPalette } from './palette';
import { createPaletteDark } from './paletteDark';
import { createPaletteLight } from './paletteLight';
import { defaultShape } from './shape';
import type { ThemeFonts } from './typography';
import { createTypography, defaultFonts } from './typography';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface CreateJumperThemeOptions {
  baseColors?: DeepPartial<BaseColors>;
  brandColors?: DeepPartial<BrandColors>;
  shape?: DeepPartial<Shape>;
  components?: Components<Omit<Theme, 'components'>>;
  fonts?: ThemeFonts;
}

export const createJumperTheme = (
  options: CreateJumperThemeOptions = {},
): Omit<Theme, 'applyStyles'> & CssVarsTheme => {
  const {
    baseColors: customBaseColors,
    brandColors: customBrandColors,
    shape: customShape = defaultShape,
    components: customComponents,
    fonts = defaultFonts,
  } = options;

  // Merge base colors
  const baseColors = customBaseColors
    ? (deepmerge(defaultBaseColors, customBaseColors) as BaseColors)
    : defaultBaseColors;

  // Merge brand colors
  const brandColors = customBrandColors
    ? (deepmerge(defaultBrandColors, customBrandColors) as BrandColors)
    : defaultBrandColors;

  const paletteLight = createPaletteLight(brandColors, baseColors);
  const paletteDark = createPaletteDark(brandColors, baseColors);
  const palette = createPalette(paletteLight, baseColors);

  const themeBase = createTheme({
    palette,
  });

  const defaultComponents = createComponents(themeBase);
  const typography = createTypography(themeBase, fonts);
  const colorSchemes = createColorSchemes(themeBase, paletteLight, paletteDark);

  const shape = customShape
    ? (deepmerge(defaultShape, customShape) as Shape)
    : defaultShape;

  const components = customComponents
    ? deepmerge(defaultComponents, customComponents)
    : defaultComponents;

  return extendTheme({
    cssVariables: true,
    cssVarPrefix: 'jumper',
    colorSchemeSelector: 'class',
    shape,
    components,
    typography,
    palette,
    colorSchemes,
  } as Parameters<typeof extendTheme>[0]);
};

export const themeCustomized = createJumperTheme();
export const lightTheme = themeCustomized;
export const darkTheme = themeCustomized;
