'use client';
import type { Components, CssVarsTheme } from '@mui/material';
import type { Shape, Theme } from '@mui/material/styles';
import { createTheme, extendTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

import './theme.types';

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

export interface CreateJumperThemeOptions {
  brandColors?: BrandColors;
  shape?: Shape;
  components?: Components<Omit<Theme, 'components'>>;
  fonts?: ThemeFonts;
}

export const createJumperTheme = (
  options: CreateJumperThemeOptions = {},
): Omit<Theme, 'applyStyles'> & CssVarsTheme => {
  const {
    brandColors = defaultBrandColors,
    shape = defaultShape,
    components: customComponents,
    fonts = defaultFonts,
  } = options;

  const paletteLight = createPaletteLight(brandColors);
  const paletteDark = createPaletteDark(brandColors);
  const palette = createPalette(paletteLight);

  const themeBase = createTheme({
    palette,
  });

  const defaultComponents = createComponents(themeBase);
  const typography = createTypography(themeBase, fonts);
  const colorSchemes = createColorSchemes(themeBase, paletteLight, paletteDark);

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
