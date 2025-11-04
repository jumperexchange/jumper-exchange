'use client';
import type { BackgroundContainerProps } from '@/components/Background';
import type {
  Color,
  ComponentsOverrides,
  ComponentsVariants,
  CssVarsTheme,
} from '@mui/material';
import type { Breakpoint, Theme } from '@mui/material/styles';
import { alpha, createTheme, extendTheme } from '@mui/material/styles';
import { colorChannel } from '@mui/system';
import type React from 'react';
import { inter, urbanist } from 'src/fonts/fonts';

import type {} from '@mui/material/themeCssVarsAugmentation';
import { paletteLight } from './paletteLight';
import { paletteDark } from './paletteDark';
import { baseColors } from './baseColors';

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
    tabBarRadius: number;
    cardBorderRadius: number;
    buttonBorderRadius: number;
    inputTextBorderRadius: number;
  }

  interface ThemeOptions {
    shape?: Partial<Shape>;
  }

  type SemanticPalette = typeof paletteLight;

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
    alphaLight100?: PaletteOptions['primary'];
    alphaLight200?: PaletteOptions['primary'];
    alphaLight300?: PaletteOptions['primary'];
    alphaLight400?: PaletteOptions['primary'];
    alphaLight500?: PaletteOptions['primary'];
    alphaLight600?: PaletteOptions['primary'];
    alphaLight700?: PaletteOptions['primary'];
    alphaLight800?: PaletteOptions['primary'];
    mint?: Pick<Color, 100 | 500>;
    amber?: Pick<Color, 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900>;
    violet?: Pick<Color, 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900>;
    blue?: Pick<Color, 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900>;
    azure?: Pick<Color, 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900>;
    scarlet?: Pick<Color, 100 | 500>;
    orchid?: Pick<Color, 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900>;
    lavenderLight?: Pick<Color, 100 | 200 | 300 | 400> & { 0: string };
    lavenderDark?: Pick<Color, 100 | 200 | 300 | 400> & { 0: string };
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
    bodyMediumStrong: React.CSSProperties;
    bodyMedium: React.CSSProperties;
    bodyMediumParagraph: React.CSSProperties;
    bodySmallStrong: React.CSSProperties;
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

  // allow configuration using `createTheme`
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
    bodyMediumStrong: React.CSSProperties;
    bodyMedium: React.CSSProperties;
    bodyMediumParagraph: React.CSSProperties;
    bodySmallStrong: React.CSSProperties;
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
    bodyMediumStrong: true;
    bodyMedium: true;
    bodyMediumParagraph: true;
    bodySmallStrong: true;
    bodySmall: true;
    bodyXSmallStrong: true;
    bodyXSmall: true;
    bodyXXSmallStrong: true;
    bodyXXSmall: true;
    brandHeaderXLarge: true;
    titleSmall: true;
    titleXSmall: true;
    title2XSmall: true;
    titleLarge: true;
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
    bodyMediumStrong: true;
    bodyMedium: true;
    bodyMediumParagraph: true;
    bodySmallStrong: true;
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

const shape = {
  borderRadius: 12,
  borderRadiusSecondary: 8,
  tabBarRadius: 128,
  cardBorderRadius: 24,
  buttonBorderRadius: 128,
  inputTextBorderRadius: 24,
};

const palette = {
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
    main: alpha(paletteLight.white.main, 0.48),
  },
  bgTertiary: {
    main: paletteLight.white.main,
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
};

const themeBase = createTheme({
  palette,
});

// in a separate 'createTheme' to allow listening to breakpoints set above
export const themeCustomized: Omit<Theme, 'applyStyles'> & CssVarsTheme =
  extendTheme({
    cssVariables: true,
    cssVarPrefix: 'jumper',
    colorSchemeSelector: 'class',
    shape,
    components: {
      MuiScopedCssBaseline: {
        styleOverrides: {
          root: {
            fontFamily: `${inter.style.fontFamily}, Arial, Noto Sans, BlinkMacSystemFont, Segoe UI, Helvetica Neue, sans-serif`,
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: () => ({
            ':last-of-type': {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            },
            boxShadow: 'unset',
            margin: 0,
          }),
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: ({ theme }) => ({
            '& .MuiTabs-scroller': {
              alignSelf: 'center',
            },
          }),
        },
      },
      MuiTab: {
        styleOverrides: {
          root: ({ theme }) => ({
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing(1),
            minWidth: '56px',
            minHeight: '40px',

            '& .MuiTab-icon': {
              marginBottom: 0,
            },
          }),
        },
      },
      MuiSnackbar: {
        styleOverrides: {
          root: ({ theme }) => ({
            top: 80,
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              top: 80,
            },
          }),
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: () => ({
            [themeBase.breakpoints.up('lg' as Breakpoint)]: {
              maxWidth: 1280,
            },
          }),
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: ({ theme }) => ({
            backgroundColor: 'rgb(0 0 0 / 64%)',
            backdropFilter: 'blur(3px)',
            fontSize: '0.75rem',
            padding: theme.spacing(1, 1.5),
          }),
          arrow: {
            color: 'rgb(0 0 0 / 64%)',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          img: {
            objectFit: 'contain',
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: (theme.vars || theme).palette.text.primary,
            '&.Mui-focused': {
              color: (theme.vars || theme).palette.text.primary,
            },
          }),
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          '@supports': { fontVariationSettings: 'normal' },
          html: {
            height: '100%',
            margin: 0,
            padding: 0,
          },
          body: {
            height: '100%',
            scrollBehavior: 'smooth',
            margin: 0,
            padding: 0,
          },
        },
      },
      MuiButton: {
        defaultProps: {
          size: 'large',
        },
        styleOverrides: {
          root: {
            borderRadius: 24,
            textTransform: 'none',
          },
          sizeSmall: {
            height: 32,
          },
          sizeMedium: {
            height: 40,
          },
          sizeLarge: {
            height: 48,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: 'inherit',
            '&:hover': {
              color: 'inherit',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                border: '1px solid #554F4E',
              },
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: '1px solid #554F4E',
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                border: '1px solid #554F4E',
              },
              '& .MuiFormLabel-root': {
                color: 'inherit',
              },
            },
          },
        },
      },
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            headerXLarge: 'p',
            headerLarge: 'p',
            headerMedium: 'p',
            headerSmall: 'p',
            headerXSmall: 'p',
            bodyXLargeStrong: 'p',
            bodyXLarge: 'p',
            bodyLargeStrong: 'p',
            bodyLarge: 'p',
            bodyMediumStrong: 'p',
            bodyMedium: 'p',
            bodyMediumParagraph: 'p',
            bodySmallStrong: 'p',
            bodySmall: 'p',
            bodyXSmallStrong: 'p',
            bodyXSmall: 'p',
            bodyXXSmallStrong: 'p',
            bodyXXSmall: 'p',
            brandHeaderXLarge: 'h1',
            urbanistTitleLarge: 'p',
            urbanistTitle2XLarge: 'p',
            urbanistTitle3XLarge: 'h1',
            urbanistBodyLarge: 'p',
            urbanistBodyXLarge: 'p',
          },
        },
      },
      Background: {
        styleOverrides: {
          root: ({ theme }: { theme: Theme }) => ({
            position: 'fixed',
            left: 0,
            bottom: 0,
            right: 0,
            top: 0,
            zIndex: -1,
            overflow: 'hidden',
            pointerEvents: 'none',
            backgroundColor: (theme.vars || theme).palette.lavenderDark[300],
            ...theme.applyStyles('light', {
              backgroundColor: (theme.vars || theme).palette.lavenderLight[200],
            }),
            // typed-safe access to the `variant` prop
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            },
          }),
        },
      },
    },
    typography: {
      fontFamily: [
        inter.style.fontFamily,
        'Arial',
        'Noto Sans',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Helvetica Neue',
        'sans-serif',
      ].join(','),
      headerXLarge: {
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '64px',
        lineHeight: '96px',
        letterSpacing: 0,
      },
      headerLarge: {
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '48px',
        lineHeight: '64px',
        letterSpacing: 0,
      },
      headerMedium: {
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '32px',
        lineHeight: '40px',
        letterSpacing: 0,
      },
      headerSmall: {
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '18px',
        lineHeight: '24px',
        letterSpacing: 0,
      },
      headerXSmall: {
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '18px',
        lineHeight: '24px',
        letterSpacing: 0,
      },
      bodyXLargeStrong: {
        fontStyle: 'normal',
        fontWeight: 800,
        fontSize: '24px',
        lineHeight: '32px',
        letterSpacing: 0,
      },
      bodyXLarge: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '24px',
        lineHeight: '32px',
        letterSpacing: 0,
      },
      bodyLargeStrong: {
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '18px',
        lineHeight: '24px',
        letterSpacing: 0,
      },
      bodyLarge: {
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '18px',
        lineHeight: '24px',
        letterSpacing: 0,
      },
      bodyMediumStrong: {
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '16px',
        lineHeight: '20px',
        letterSpacing: 0,
      },
      bodyMedium: {
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '20px',
        letterSpacing: 0,
      },
      bodyMediumParagraph: {
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: 0,
      },
      bodySmallStrong: {
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '14px',
        lineHeight: '18px',
        letterSpacing: 0,
      },
      bodySmall: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: 0,
      },
      bodyXSmallStrong: {
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: 0,
      },
      bodyXSmall: {
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: '16px',
        letterSpacing: 0,
      },
      bodyXXSmallStrong: {
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '10px',
        lineHeight: '14px',
        letterSpacing: 0,
      },
      bodyXXSmall: {
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '10px',
        lineHeight: '14px',
        letterSpacing: 0,
      },
      brandHeaderXLarge: {
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '64px',
        lineHeight: '72px',
        letterSpacing: 0,
      },
      titleSmall: {
        fontFamily: inter.style.fontFamily,
        fontSize: '24px',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: '32px',
      },
      title2XSmall: {
        fontFamily: inter.style.fontFamily,
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: '20px',
      },
      titleMedium: {
        fontFamily: inter.style.fontFamily,
        fontSize: '32px',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: '40px',
      },
      titleLarge: {
        fontSize: '48px',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: '64px',
      },
      titleXSmall: {
        fontFamily: inter.style.fontFamily,
        fontSize: '18px',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: '24px',
      },
      urbanistTitleXSmall: {
        fontFamily: urbanist.style.fontFamily,
        fontSize: '18px',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: '24px',
      },
      urbanistTitleLarge: {
        fontFamily: urbanist.style.fontFamily,
        fontSize: '48px',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: '56px',
      },
      urbanistTitleXLarge: {
        fontFamily: urbanist.style.fontFamily,
        fontSize: '64px',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: '72px',
      },
      urbanistTitle2XLarge: {
        fontFamily: urbanist.style.fontFamily,
        fontSize: '80px',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: '96px',
      },
      urbanistTitle3XLarge: {
        fontSize: '96px',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: '112px',
      },
      urbanistTitleMedium: {
        fontFamily: urbanist.style.fontFamily,
        fontSize: '32px',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: '40px',
      },
      urbanistBodyLarge: {
        fontFamily: urbanist.style.fontFamily,
        fontSize: '18px',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: '24px',
      },
      urbanistBodyXLarge: {
        fontFamily: urbanist.style.fontFamily,
        fontSize: '24px',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: '32px',
      },
      urbanistBody2XLarge: {
        fontFamily: urbanist.style.fontFamily,
        fontSize: '32px',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: '40px',
      },
      h1: {
        fontFamily: urbanist.style.fontFamily,
        fontSize: themeBase.typography.pxToRem(48),
        lineHeight: themeBase.typography.pxToRem(64),
        letterSpacing: 'inherit',
        fontWeight: 700,
        [themeBase.breakpoints.up('sm' as Breakpoint)]: {
          fontSize: themeBase.typography.pxToRem(64),
          lineHeight: themeBase.typography.pxToRem(72),
        },
      },
      h2: {
        fontFamily: urbanist.style.fontFamily,
        fontSize: themeBase.typography.pxToRem(36),
        lineHeight: themeBase.typography.pxToRem(48),
        fontWeight: 700,
      },
      h3: {
        fontFamily: urbanist.style.fontFamily,
        fontSize: themeBase.typography.pxToRem(28),
        lineHeight: themeBase.typography.pxToRem(36),
        fontWeight: 700,
      },
      h4: {
        fontFamily: urbanist.style.fontFamily,
        fontSize: themeBase.typography.pxToRem(22),
        lineHeight: themeBase.typography.pxToRem(28),
        fontWeight: 700,
      },
      h5: {
        fontFamily: urbanist.style.fontFamily,
        fontSize: themeBase.typography.pxToRem(18),
        lineHeight: themeBase.typography.pxToRem(24),
        fontWeight: 700,
      },
      h6: {
        fontFamily: urbanist.style.fontFamily,
        fontSize: themeBase.typography.pxToRem(12),
        lineHeight: themeBase.typography.pxToRem(18),
        fontWeight: 700,
      },
    },
    palette,
    colorSchemes: {
      light: {
        palette: {
          ...paletteLight,
          semanticPalette: paletteLight,
          mode: 'light',
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
            main: alpha(themeBase.palette.white.main, 0.48),
          },
          bgTertiary: {
            main: themeBase.palette.white.main,
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
        // @ts-expect-error
        shadows: [
          'none',
          '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)',
          '0px 2px 8px 0px rgba(0, 0, 0, 0.04)', // elevation-1
          '0px 4px 24px 0px rgba(0, 0, 0, 0.08)', // elevation-4
          ...themeBase.shadows.slice(3),
        ],
      },
      dark: {
        palette: {
          ...paletteDark,
          semanticPalette: paletteDark,
          mode: 'dark',
          Tooltip: {
            bg: themeBase.palette.black.main,
          },
          background: {
            default: '#120F29', //'#241D52',
            paper: '#24203d', //'#241D52',
          },
          text: {
            primary: themeBase.palette.white.main,
            secondary: alpha(themeBase.palette.white.main, 0.75),
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
            main: '#120F29',
          },
          bgSecondary: {
            main: alpha(themeBase.palette.white.main, 0.12),
          },
          bgTertiary: {
            main: themeBase.palette.alphaLight200.main,
          },
          bgQuaternary: {
            hover: alpha('#653BA3', 0.56),
            main: alpha('#653BA3', 0.42),
          },
          primary: {
            light: '#653BA3',
            main: '#653BA3',
            dark: '#543188',
          },
          secondary: {
            light: '#321D52',
            main: '#321D52',
            dark: '#321D52',
          },
          tertiary: {
            light: '#33163D',
            main: '#33163D',
            dark: '#33163D',
          },
          accent1: {
            light: '#653BA3',
            main: '#653BA3',
            dark: '#653BA3',
          },
          accent1Alt: {
            light: '#BEA0EB',
            main: '#BEA0EB',
            dark: '#BEA0EB',
          },
          accent2: {
            light: '#D35CFF',
            main: '#D35CFF',
            dark: '#D35CFF',
          },
          surface1: {
            light: '#120F29',
            main: '#120F29',
            dark: '#120F29',
          },
          surface2: {
            light: '#24203D',
            main: '#24203D',
            dark: '#24203D',
          },
          surface3: {
            light: '#120F29',
            main: '#120F29',
            dark: '#120F29',
          },
          surface4: {
            light: paletteDark.surface4,
            main: paletteDark.surface4,
            dark: paletteDark.surface4,
          },
        },
        // @ts-expect-error
        shadows: [
          'none',
          '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
          '0px 2px 8px 0px rgba(0, 0, 0, 0.04)', // elevation-1
          '0px 4px 24px 0px rgba(0, 0, 0, 0.08)', // elevation-4
          ...themeBase.shadows.slice(3),
        ],
      },
    },
  });

export const lightTheme = themeCustomized;
export const darkTheme = themeCustomized;
