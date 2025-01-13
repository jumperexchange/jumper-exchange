'use client';
import type { BackgroundContainerProps } from '@/components/Background';
import type { ComponentsOverrides, ComponentsVariants } from '@mui/material';
import type { Breakpoint, Theme } from '@mui/material/styles';
import { alpha, createTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import type React from 'react';
import { inter, urbanist } from 'src/fonts/fonts';

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
  }

  interface ThemeOptions {
    shape?: Partial<Shape>;
  }
  interface Palette {
    tertiary: Palette['primary'];
    white: Palette['primary'];
    black: Palette['primary'];
    accent1: Palette['primary'];
    accent1Alt: Palette['primary'];
    accent2: Palette['primary'];
    surface1: Palette['primary'];
    surface2: Palette['primary'];
    surface3: Palette['primary'];
    templateBg: Palette['primary'];
    templateOutline: Palette['primary'];
    dataBg: Palette['primary'];
    dataOutline: Palette['primary'];
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
    alphaLight100: Palette['primary'];
    alphaLight200: Palette['primary'];
    alphaLight300: Palette['primary'];
    alphaLight400: Palette['primary'];
    alphaLight500: Palette['primary'];
    alphaLight600: Palette['primary'];
    alphaLight700: Palette['primary'];
    alphaLight800: Palette['primary'];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
    white?: PaletteOptions['primary'];
    black?: PaletteOptions['primary'];
    accent1?: PaletteOptions['primary'];
    accent1Alt?: PaletteOptions['primary'];
    accent2?: PaletteOptions['primary'];
    surface1?: PaletteOptions['primary'];
    surface2?: PaletteOptions['primary'];
    surface3?: PaletteOptions['primary'];
    templateBg?: Palette['primary'];
    templateOutline?: Palette['primary'];
    dataBg?: Palette['primary'];
    dataOutline?: Palette['primary'];
    bg?: PaletteOptions['primary'];
    bgSecondary?: PaletteOptions['primary'];
    bgTertiary?: PaletteOptions['primary'];
    bgQuaternary?: PaletteOptions['primary'];
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
  }
  interface TypographyVariants {
    headerDisplay: React.CSSProperties;
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
    bodySmallStrong: React.CSSProperties;
    bodySmall: React.CSSProperties;
    bodyXSmallStrong: React.CSSProperties;
    bodyXSmall: React.CSSProperties;
    brandHeaderXLarge: React.CSSProperties;
    titleSmall: React.CSSProperties;
    titleXSmall: React.CSSProperties;
    title2XSmall: React.CSSProperties;
    urbanistTitleXSmall: React.CSSProperties;
    urbanistTitleLarge: React.CSSProperties;
    urbanistTitleXLarge: React.CSSProperties;
    urbanistTitle2XLarge: React.CSSProperties;
    urbanistTitle3XLarge: React.CSSProperties;
    urbanistTitleMedium: React.CSSProperties;
    urbanistBodyLarge: React.CSSProperties;
    urbanistBodyXLarge: React.CSSProperties;
    urbanistBody2XLarge: React.CSSProperties;
    titleLarge: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    headerDisplay?: React.CSSProperties;
    headerXLarge?: React.CSSProperties;
    headerLarge?: React.CSSProperties;
    headerMedium?: React.CSSProperties;
    headerSmall?: React.CSSProperties;
    headerXSmall?: React.CSSProperties;
    bodyXLargeStrong?: React.CSSProperties;
    bodyXLarge: React.CSSProperties;
    bodyLargeStrong: React.CSSProperties;
    bodyLarge: React.CSSProperties;
    bodyMediumStrong: React.CSSProperties;
    bodyMedium: React.CSSProperties;
    bodySmallStrong: React.CSSProperties;
    bodySmall: React.CSSProperties;
    bodyXSmallStrong: React.CSSProperties;
    bodyXSmall: React.CSSProperties;
    brandHeaderXLarge: React.CSSProperties;
    titleSmall: React.CSSProperties;
    titleXSmall: React.CSSProperties;
    title2XSmall: React.CSSProperties;
    urbanistTitleXSmall: React.CSSProperties;
    urbanistTitleLarge: React.CSSProperties;
    urbanistTitleXLarge: React.CSSProperties;
    urbanistTitle2XLarge: React.CSSProperties;
    urbanistTitle3XLarge: React.CSSProperties;
    urbanistTitleMedium: React.CSSProperties;
    urbanistBodyLarge: React.CSSProperties;
    urbanistBodyXLarge: React.CSSProperties;
    urbanistBody2XLarge: React.CSSProperties;
    titleLarge: React.CSSProperties;
  }
}
declare module '@mui/material/Button' {
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
    templateBg: true;
    templateOutline: true;
    dataBg: true;
    dataOutline: true;
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
    alphaLight100: true;
    alphaLight200: true;
    alphaLight300: true;
    alphaLight400: true;
    alphaLight500: true;
    alphaLight600: true;
    alphaLight700: true;
    alphaLight800: true;
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    '@supports (font-variation-settings: normal)': true;
    headerDisplay: true;
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
    bodySmallStrong: true;
    bodySmall: true;
    bodyXSmallStrong: true;
    bodyXSmall: true;
    brandHeaderXLarge: true;
    titleSmall: true;
    titleXSmall: true;
    title2XSmall: true;
    urbanistTitleXSmall: true;
    urbanistTitleLarge: true;
    urbanistTitle2XLarge: true;
    urbanistTitleXLarge: true;
    urbanistTitle3XLarge: true;
    urbanistTitleMedium: true;
    urbanistBodyLarge: true;
    urbanistBodyXLarge: true;
    urbanistBody2XLarge: true;
    titleLarge: true;
  }
}

const shape = {
  borderRadius: 12,
  borderRadiusSecondary: 8,
};

const themeBase = createTheme();

// in a separate 'createTheme' to allow listening to breakpoints set above
const themeCustomized = createTheme({
  shape: {
    ...shape,
  },
  components: {
    Background: {
      styleOverrides: {
        // the slot name defined in the `slot` and `overridesResolver` parameters
        // of the `styled` API
        root: ({ theme }) => ({
          position: 'fixed',
          left: 0,
          bottom: 0,
          right: 0,
          top: 0,
          zIndex: -1,
          overflow: 'hidden',
          pointerEvents: 'none',
          backgroundColor: theme.palette.bg.main,
          // typed-safe access to the `variant` prop
          [theme.breakpoints.up('sm' as Breakpoint)]: {
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          },
        }),
      },
    },
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
          color: theme.palette.text.primary,
          '&.Mui-focused': {
            color: theme.palette.text.primary,
          },
        }),
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '@supports': { fontVariationSettings: 'normal' },
        body: { scrollBehavior: 'smooth' },
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
          headerDisplay: 'p',
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
          bodySmallStrong: 'p',
          bodySmall: 'p',
          bodyXSmallStrong: 'p',
          bodyXSmall: 'p',
          brandHeaderXLarge: 'h1',
          urbanistTitleLarge: 'p',
          urbanistTitle2XLarge: 'p',
          urbanistTitle3XLarge: 'h1',
          urbanistBodyLarge: 'p',
          urbanistBodyXLarge: 'p',
        },
      },
    },
  },
  palette: {
    grey: {
      100: '#F6F5FA',
      200: '#ECEBF0',
      300: '#DDDCE0',
      400: '#C9C8CC',
      500: '#9DA1A3',
      600: '#8A8D8F',
      700: '#70767A',
      800: '#4B4F52',
      900: '#000000',
    },
    success: {
      main: '#0AA65B',
      light: '#0AA65B',
      dark: '#0AA65B',
    },
    error: {
      main: '#E5452F',
      light: '#E5452F',
      dark: '#E5452F',
    },
    warning: {
      main: '#FFCC00',
      light: '#FFCC00',
      dark: '#EBC942',
    },
    info: {
      main: '#297EFF',
      light: '#297EFF',
      dark: '#297EFF',
    },
    white: {
      main: '#FFFFFF',
      light: '#FFFFFF',
      dark: '#FFFFFF',
    },
    black: {
      main: '#000000',
      light: '#000000',
      dark: '#000000',
    },
    alphaDark100: {
      main: 'rgba(0, 0, 0, 0.04)',
    },
    alphaDark200: {
      main: 'rgba(0, 0, 0, 0.08)',
    },
    alphaDark300: {
      main: 'rgba(0, 0, 0, 0.12)',
    },
    alphaDark400: {
      main: 'rgba(0, 0, 0, 0.16)',
    },
    alphaDark500: {
      main: 'rgba(0, 0, 0, 0.24)',
    },
    alphaDark600: {
      main: 'rgba(0, 0, 0, 0.32)',
    },
    alphaDark700: {
      main: 'rgba(0, 0, 0, 0.48)',
    },
    alphaDark800: {
      main: 'rgba(0, 0, 0, 0.64)',
    },
    alphaLight100: {
      main: 'rgba(255, 255, 255, 0.04)',
    },
    alphaLight200: {
      main: 'rgba(255, 255, 255, 0.08)',
    },
    alphaLight300: {
      main: 'rgba(255, 255, 255, 0.12)',
    },
    alphaLight400: {
      main: 'rgba(255, 255, 255, 0.16)',
    },
    alphaLight500: {
      main: 'rgba(255, 255, 255, 0.24)',
    },
    alphaLight600: {
      main: 'rgba(255, 255, 255, 0.32)',
    },
    alphaLight700: {
      main: 'rgba(255, 255, 255, 0.48)',
    },
    alphaLight800: {
      main: 'rgba(255, 255, 255, 0.64)',
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
    headerDisplay: {
      fontStyle: 'normal',
      fontSize: '96px',
      lineHeight: '128px',
      fontWeight: 700,
    },
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
    brandHeaderXLarge: {
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '64px',
      lineHeight: '72px',
      letterSpacing: 0,
    },
    title2XSmall: {
      fontFamily: inter.style.fontFamily,
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: '20px',
    },
    titleXSmall: {
      fontFamily: inter.style.fontFamily,
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: '24px',
    },
    titleSmall: {
      fontFamily: inter.style.fontFamily,
      fontSize: '24px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: '32px',
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
    titleLarge: {
      fontSize: '48px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: '64px',
    },
  },
});

const themePreset = createTheme(deepmerge(themeBase, themeCustomized));

export const lightTheme = createTheme(
  deepmerge(themePreset, {
    palette: {
      mode: 'light',
      background: {
        default: '#FCFAFF',
      },
      text: {
        primary: '#000',
        secondary: alpha(themeCustomized.palette.black.main, 0.75),
      },
      grey: {
        300: '#E5E1EB',
      },
      bg: {
        light: '#F3EBFF',
        main: '#F3EBFF',
        dark: '#F3EBFF',
      },
      bgSecondary: {
        main: alpha(themeCustomized.palette.white.main, 0.48),
      },
      bgTertiary: {
        main: themeCustomized.palette.white.main,
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
        light: '#31007A',
        main: '#31007A',
        dark: '#31007A',
      },
      accent1Alt: {
        light: '#BEA0EB',
        main: '#BEA0EB',
        dark: '#BEA0EB',
      },
      accent2: {
        light: '#8700B8',
        main: '#8700B8',
        dark: '#8700B8',
      },
      surface1: {
        light: '#faf5ff',
        main: '#faf5ff',
        dark: '#faf5ff',
      },
      surface2: {
        light: '#FFFFFF',
        main: '#FFFFFF',
        dark: '#FFFFFF',
      },
      surface3: {
        light: '#E5E1EB',
        main: '#E5E1EB',
        dark: '#E5E1EB',
      },
      templateBg: {
        light: '#FEF5FF',
        main: '#FEF5FF',
        dark: '#FEF5FF',
      },
      templateOutline: {
        light: '#C95CFF',
        main: '#C95CFF',
        dark: '#C95CFF',
      },
      dataBg: {
        light: '#F5F6FF',
        main: '#F5F6FF',
        dark: '#F5F6FF',
      },
      dataOutline: {
        light: '#7B61FF',
        main: '#7B61FF',
        dark: '#7B61FF',
      },
    },
    shadows: [
      'none',
      '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)',
      '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
      ...themeBase.shadows.slice(3),
    ],
  }),
);

export const darkTheme = createTheme(
  deepmerge(themePreset, {
    components: {
      Background: {
        styleOverrides: {
          // functions cannot merged because of mui... I know it's bad :(
          root: ({ theme }: { theme: Theme }) => ({
            position: 'fixed',
            left: 0,
            bottom: 0,
            right: 0,
            top: 0,
            zIndex: -1,
            overflow: 'hidden',
            pointerEvents: 'none',
            backgroundColor: theme.palette.surface1.main,
            // typed-safe access to the `variant` prop
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            },
          }),
        },
      },
    },
    palette: {
      mode: 'dark',
      background: {
        default: '#120F29', //'#241D52',
      },
      text: {
        primary: '#fff',
        secondary: alpha(themeCustomized.palette.white.main, 0.75),
      },
      grey: {
        800: '#302B52',
      },
      bg: {
        light: '#030014',
        main: '#030014',
        dark: '#030014',
      },
      bgSecondary: {
        main: alpha(themeCustomized.palette.white.main, 0.12),
      },
      bgTertiary: {
        main: themeCustomized.palette.alphaLight200.main,
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
        light: '#302B52',
        main: '#302B52',
        dark: '#302B52',
      },
      templateBg: {
        light: '#401946',
        main: '#401946',
        dark: '#401946',
      },
      templateOutline: {
        light: '#D47BEB',
        main: '#D47BEB',
        dark: '#D47BEB',
      },
      dataBg: {
        light: '#28203D',
        main: '#28203D',
        dark: '#28203D',
      },
      dataOutline: {
        light: '#B8ADFF',
        main: '#B8ADFF',
        dark: '#B8ADFF',
      },
    },
    shadows: [
      'none',
      '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
      '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
      ...themeBase.shadows.slice(3),
    ],
  }),
);
