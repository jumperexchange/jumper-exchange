import type { BackgroundContainerProps } from '@/components/Background';
import type {
  Color,
  ComponentsOverrides,
  ComponentsVariants,
} from '@mui/material';
import type React from 'react';

import type {} from '@mui/material/themeCssVarsAugmentation';

import type { ThemeBorders } from './borders';
import type { createPaletteLight } from './paletteLight';

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey {
    Background: 'root' | 'value' | 'unit';
  }
  interface ComponentsPropsList {
    Background: Partial<BackgroundContainerProps>;
  }
  interface Components {
    Background?: {
      defaultProps?: ComponentsPropsList['Background'];
      styleOverrides?: ComponentsOverrides<Theme>['Background'];
      variants?: ComponentsVariants['Background'];
    };
  }
  interface Shape {
    borderRadius: number;
    borderRadiusSecondary: number;
    borderRadiusTertiary: number;
    radiusRoundedFull: string;
    radius4: number;
    radius8: number;
    radius12: number;
    radius16: number;
    radius20: number;
    radius24: number;
    radius32: number;
    radius64: number;
    radius128: number;
    tabBarRadius: number;
    tabRadius: number;
    menuRadius: number;
    cardContainerBorderRadius: number;
    /** @deprecated Use cardBorderRadiusLarge instead */
    cardBorderRadius: number;
    cardBorderRadiusSmall: number;
    cardBorderRadiusMedium: number;
    cardBorderRadiusLarge: number;
    cardBorderRadiusXLarge: number;
    buttonBorderRadius: number;
    inputTextBorderRadius: number;
    scanBorderRadiusSecondary?: number;
    scanBorderRadiusTertiary?: number;
    scanBorderRadius?: number;
  }

  interface ThemeOptions {
    shape?: Partial<Shape>;
    borders?: Partial<ThemeBorders>;
  }

  interface Theme {
    borders: ThemeBorders;
  }

  type SemanticPalette = ReturnType<typeof createPaletteLight>;

  interface Palette extends SemanticPalette {
    tertiary: Palette['primary'];
    white: Palette['primary'];
    black: Palette['primary'];
    accent1: Palette['primary'];
    accent1Alt: Palette['primary'];
    accent2: Palette['primary'];
    surface1: Palette['primary'];
    surface2: Palette['primary'];
    surface3: Palette['primary'];
    surface4: Palette['primary'];
    bg: Palette['primary'];
    bgSecondary: Palette['primary'];
    bgTertiary: Palette['primary'];
    bgQuaternary: {
      main: string;
      hover: string;
    };
    alphaDark100: Palette['primary'];
    alphaDark200: Palette['primary'];
    alphaDark300: Palette['primary'];
    alphaDark400: Palette['primary'];
    alphaDark500: Palette['primary'];
    alphaDark600: Palette['primary'];
    alphaDark700: Palette['primary'];
    alphaDark800: Palette['primary'];
    alphaDark900: Palette['primary'];
    alphaLight100: Palette['primary'];
    alphaLight200: Palette['primary'];
    alphaLight300: Palette['primary'];
    alphaLight400: Palette['primary'];
    alphaLight500: Palette['primary'];
    alphaLight600: Palette['primary'];
    alphaLight700: Palette['primary'];
    alphaLight800: Palette['primary'];
    alphaLight900: Palette['primary'];
    mint: Pick<Color, 100 | 500>;
    amber: Pick<Color, 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900>;
    violet: Pick<Color, 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900>;
    blue: Pick<Color, 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900>;
    azure: Pick<Color, 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900>;
    scarlet: Pick<Color, 100 | 500>;
    orchid: Pick<Color, 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900>;
    lavenderLight: Pick<Color, 100 | 200 | 300 | 400> & { 0: string };
    lavenderDark: Pick<Color, 100 | 200 | 300 | 400> & { 0: string };
    rubyLight: Pick<Color, 100 | 200 | 300 | 400> & { 0: string };
    rubyDark: Pick<Color, 100 | 200 | 300 | 400 | 500> & { 0: string };
    semanticPalette: SemanticPalette;
  }

  interface PaletteOptions extends Partial<SemanticPalette> {
    tertiary?: PaletteOptions['primary'];
    white?: PaletteOptions['primary'];
    black?: PaletteOptions['primary'];
    accent1?: PaletteOptions['primary'];
    accent1Alt?: PaletteOptions['primary'];
    accent2?: PaletteOptions['primary'];
    surface1?: PaletteOptions['primary'];
    surface2?: PaletteOptions['primary'];
    surface3?: PaletteOptions['primary'];
    surface4?: PaletteOptions['primary'];
    bg?: PaletteOptions['primary'];
    bgSecondary?: PaletteOptions['primary'];
    bgTertiary?: PaletteOptions['primary'];
    bgQuaternary?: {
      main: string;
      hover: string;
    };
    alphaDark100?: PaletteOptions['primary'];
    alphaDark200?: PaletteOptions['primary'];
    alphaDark300?: PaletteOptions['primary'];
    alphaDark400?: PaletteOptions['primary'];
    alphaDark500?: PaletteOptions['primary'];
    alphaDark600?: PaletteOptions['primary'];
    alphaDark700?: PaletteOptions['primary'];
    alphaDark800?: PaletteOptions['primary'];
    alphaDark900?: PaletteOptions['primary'];
    alphaLight100?: PaletteOptions['primary'];
    alphaLight200?: PaletteOptions['primary'];
    alphaLight300?: PaletteOptions['primary'];
    alphaLight400?: PaletteOptions['primary'];
    alphaLight500?: PaletteOptions['primary'];
    alphaLight600?: PaletteOptions['primary'];
    alphaLight700?: PaletteOptions['primary'];
    alphaLight800?: PaletteOptions['primary'];
    alphaLight900?: PaletteOptions['primary'];
    mint?: Pick<Color, 100 | 500>;
    amber?: Pick<Color, 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900>;
    violet?: Pick<Color, 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900>;
    blue?: Pick<Color, 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900>;
    azure?: Pick<Color, 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900>;
    scarlet?: Pick<Color, 100 | 500>;
    orchid?: Pick<Color, 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900>;
    lavenderLight?: Pick<Color, 100 | 200 | 300 | 400> & { 0: string };
    lavenderDark?: Pick<Color, 100 | 200 | 300 | 400> & { 0: string };
    rubyLight?: Pick<Color, 100 | 200 | 300 | 400> & { 0: string };
    rubyDark?: Pick<Color, 100 | 200 | 300 | 400 | 500> & { 0: string };
    semanticPalette?: SemanticPalette;
  }
  interface ButtonPropsColorOverrides {
    tertiary: true;
    white: true;
    black: true;
    accent1: true;
    accent1Alt: true;
    accent2: true;
    surface1: true;
    surface2: true;
    surface3: true;
    surface4: true;
    bg: true;
    bgSecondary: true;
    bgTertiary: true;
    bgQuaternary: true;
    alphaDark100: true;
    alphaDark200: true;
    alphaDark300: true;
    alphaDark400: true;
    alphaDark500: true;
    alphaDark600: true;
    alphaDark700: true;
    alphaDark800: true;
    alphaDark900: true;
    alphaLight100: true;
    alphaLight200: true;
    alphaLight300: true;
    alphaLight400: true;
    alphaLight500: true;
    alphaLight600: true;
    alphaLight700: true;
    alphaLight800: true;
    alphaLight900: true;
    mint: true;
    amber: true;
    violet: true;
    blue: true;
    azure: true;
    scarlet: true;
    orchid: true;
    lavenderLight: true;
    lavenderDark: true;
    rubyLight: true;
    rubyDark: true;
  }

  interface TypographyVariants {
    headerXLarge: React.CSSProperties;
    headerLarge: React.CSSProperties;
    headerMedium: React.CSSProperties;
    headerSmall: React.CSSProperties;
    headerXSmall: React.CSSProperties;
    bodyXLargeStrong: React.CSSProperties;
    bodyXLarge: React.CSSProperties;
    bodyLargeStrong: React.CSSProperties;
    bodyLarge: React.CSSProperties;
    bodyLargeParagraph: React.CSSProperties;
    bodyMediumStrong: React.CSSProperties;
    bodyMedium: React.CSSProperties;
    bodyMediumParagraph: React.CSSProperties;
    bodySmallStrong: React.CSSProperties;
    bodySmallParagraph: React.CSSProperties;
    bodySmall: React.CSSProperties;
    bodyXSmallStrong: React.CSSProperties;
    bodyXSmall: React.CSSProperties;
    bodyXXSmallStrong: React.CSSProperties;
    bodyXXSmall: React.CSSProperties;
    brandHeaderXLarge: React.CSSProperties;
    titleSmall: React.CSSProperties;
    titleMedium: React.CSSProperties;
    titleXSmall: React.CSSProperties;
    title2XSmall: React.CSSProperties;
    titleLarge: React.CSSProperties;
    title2XLarge: React.CSSProperties;
    urbanistTitleXSmall: React.CSSProperties;
    urbanistTitleLarge: React.CSSProperties;
    urbanistTitleXLarge: React.CSSProperties;
    urbanistTitle2XLarge: React.CSSProperties;
    urbanistTitle3XLarge: React.CSSProperties;
    urbanistTitleMedium: React.CSSProperties;
    urbanistBodyLarge: React.CSSProperties;
    urbanistBodyXLarge: React.CSSProperties;
    urbanistBody2XLarge: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    headerXLarge: React.CSSProperties;
    headerLarge: React.CSSProperties;
    headerMedium: React.CSSProperties;
    headerSmall: React.CSSProperties;
    headerXSmall: React.CSSProperties;
    bodyXLargeStrong: React.CSSProperties;
    bodyXLarge: React.CSSProperties;
    bodyLargeStrong: React.CSSProperties;
    bodyLarge: React.CSSProperties;
    bodyLargeParagraph: React.CSSProperties;
    bodyMediumStrong: React.CSSProperties;
    bodyMedium: React.CSSProperties;
    bodyMediumParagraph: React.CSSProperties;
    bodySmallStrong: React.CSSProperties;
    bodySmallParagraph: React.CSSProperties;
    bodySmall: React.CSSProperties;
    bodyXSmallStrong: React.CSSProperties;
    bodyXSmall: React.CSSProperties;
    bodyXXSmallStrong: React.CSSProperties;
    bodyXXSmall: React.CSSProperties;
    brandHeaderXLarge: React.CSSProperties;
    titleSmall: React.CSSProperties;
    titleMedium: React.CSSProperties;
    titleXSmall: React.CSSProperties;
    title2XSmall: React.CSSProperties;
    titleLarge: React.CSSProperties;
    title2XLarge: React.CSSProperties;
    urbanistTitleXSmall: React.CSSProperties;
    urbanistTitleLarge: React.CSSProperties;
    urbanistTitleXLarge: React.CSSProperties;
    urbanistTitle2XLarge: React.CSSProperties;
    urbanistTitle3XLarge: React.CSSProperties;
    urbanistTitleMedium: React.CSSProperties;
    urbanistBodyLarge: React.CSSProperties;
    urbanistBodyXLarge: React.CSSProperties;
    urbanistBody2XLarge: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    '@supports (font-variation-settings: normal)': true;
    headerXLarge: true;
    headerLarge: true;
    headerMedium: true;
    headerSmall: true;
    headerXSmall: true;
    bodyXLargeStrong: true;
    bodyXLarge: true;
    bodyLargeStrong: true;
    bodyLarge: true;
    bodyLargeParagraph: true;
    bodyMediumStrong: true;
    bodyMedium: true;
    bodyMediumParagraph: true;
    bodySmallStrong: true;
    bodySmallParagraph: true;
    bodySmall: true;
    bodyXSmallStrong: true;
    bodyXSmall: true;
    bodyXXSmallStrong: true;
    bodyXXSmall: true;
    brandHeaderXLarge: true;
    titleSmall: true;
    titleMedium: true;
    titleXSmall: true;
    title2XSmall: true;
    titleLarge: true;
    title2XLarge: true;
    urbanistTitleXSmall: true;
    urbanistTitleLarge: true;
    urbanistTitle2XLarge: true;
    urbanistTitleXLarge: true;
    urbanistTitle3XLarge: true;
    urbanistTitleMedium: true;
    urbanistBodyLarge: true;
    urbanistBodyXLarge: true;
    urbanistBody2XLarge: true;
  }
}
