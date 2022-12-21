import { createTheme, Theme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import React from 'react';
import { bodyStyled, resetStyled, viewports } from '../style';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
    white: Palette['primary'];
    black: Palette['primary'];
    accent1: Palette['primary'];
    accent2: Palette['primary'];
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
    accent2?: PaletteOptions['primary'];
    bg?: PaletteOptions['primary'];
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
    lifiHeaderDisplay: React.CSSProperties;
    lifiHeaderXLarge: React.CSSProperties;
    lifiHeaderLarge: React.CSSProperties;
    lifiHeaderMedium: React.CSSProperties;
    lifiHeaderSmall: React.CSSProperties;
    lifiHeaderXSmall: React.CSSProperties;
    lifiBodyXLargeStrong: React.CSSProperties;
    lifiBodyXLarge: React.CSSProperties;
    lifiBodyLargeStrong: React.CSSProperties;
    lifiBodyLarge: React.CSSProperties;
    lifiBodyMediumStrong: React.CSSProperties;
    lifiBodyMedium: React.CSSProperties;
    lifiBodySmallStrong: React.CSSProperties;
    lifiBodySmall: React.CSSProperties;
    lifiBodyXSmallStrong: React.CSSProperties;
    lifiBodyXSmall: React.CSSProperties;
    lifiMono5: React.CSSProperties;
    lifiMono4: React.CSSProperties;
    lifiMono3: React.CSSProperties;
    lifiMono2: React.CSSProperties;
    lifiMono1: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    lifiHeaderDisplay?: React.CSSProperties;
    lifiHeaderXLarge?: React.CSSProperties;
    lifiHeaderLarge?: React.CSSProperties;
    lifiHeaderMedium?: React.CSSProperties;
    lifiHeaderSmall?: React.CSSProperties;
    lifiHeaderXSmall?: React.CSSProperties;
    lifiBodyXLargeStrong?: React.CSSProperties;
    lifiBodyXLarge: React.CSSProperties;
    lifiBodyLargeStrong: React.CSSProperties;
    lifiBodyLarge: React.CSSProperties;
    lifiBodyMediumStrong: React.CSSProperties;
    lifiBodyMedium: React.CSSProperties;
    lifiBodySmallStrong: React.CSSProperties;
    lifiBodySmall: React.CSSProperties;
    lifiBodyXSmallStrong: React.CSSProperties;
    lifiBodyXSmall: React.CSSProperties;
    lifiMono5: React.CSSProperties;
    lifiMono4: React.CSSProperties;
    lifiMono3: React.CSSProperties;
    lifiMono2: React.CSSProperties;
    lifiMono1: React.CSSProperties;
  }
}
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    tertiary: true;
    white: true;
    black: true;
    accent1: true;
    accent2: true;
    bg: true;
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
    lifiHeaderDisplay: true;
    lifiHeaderXLarge: true;
    lifiHeaderLarge: true;
    lifiHeaderMedium: true;
    lifiHeaderSmall: true;
    lifiHeaderXSmall: true;
    lifiBodyXLargeStrong: true;
    lifiBodyXLarge: true;
    lifiBodyLargeStrong: true;
    lifiBodyLarge: true;
    lifiBodyMediumStrong: true;
    lifiBodyMedium: true;
    lifiBodySmallStrong: true;
    lifiBodySmall: true;
    lifiBodyXSmallStrong: true;
    lifiBodyXSmall: true;
    lifiMono5: true;
    lifiMono4: true;
    lifiMono3: true;
    lifiMono2: true;
    lifiMono1: true;
  }
}

const themeBase: Theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `${resetStyled} ${bodyStyled}`,
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          lifiHeaderDisplay: 'p',
          lifiHeaderXLarge: 'p',
          lifiHeaderLarge: 'p',
          lifiHeaderMedium: 'p',
          lifiHeaderSmall: 'p',
          lifiHeaderXSmall: 'p',
          lifiBodyXLargeStrong: 'p',
          lifiBodyXLarge: 'p',
          lifiBodyLargeStrong: 'p',
          lifiBodyLarge: 'p',
          lifiBodyMediumStrong: 'p',
          lifiBodyMedium: 'p',
          lifiBodySmallStrong: 'p',
          lifiBodySmall: 'p',
          lifiBodyXSmallStrong: 'p',
          lifiBodyXSmall: 'p',
          lifiMono5: 'p',
          lifiMono4: 'p',
          lifiMono3: 'p',
          lifiMono2: 'p',
          lifiMono1: 'p',
        },
      },
    },
  },
  spacing: 4,
  palette: {
    primary: {
      light: '#31007A',
      main: '#31007A',
      dark: '#31007A',
      // contrastText: '#fff',
    },
    secondary: {
      light: 'rgba(49, 0, 122, 0.08)',
      main: 'rgba(49, 0, 122, 0.08)',
      dark: 'rgba(49, 0, 122, 0.08)',
      // contrastText: '#fff',
    },
    tertiary: {
      light: 'rgba(135, 0, 184, 0.08)',
      main: 'rgba(135, 0, 184, 0.08)',
      dark: 'rgba(135, 0, 184, 0.08)',
      // contrastText: '#fff',
    },
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
      main: '#FFE668',
      light: '#FFE668',
      dark: '#FFE668',
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
  breakpoints: {
    values: {
      xs: 0,
      sm: viewports.minTablet,
      md: viewports.minLaptop,
      lg: viewports.minDesktop,
      xl: viewports.minDesktopFullHd,
    },
  },
});

// in a seperate 'createTheme' to allow listening to breakpoints set above
const themeTypographyPreset: Theme = createTheme({
  ...themeBase,
  typography: {
    fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
    lifiHeaderDisplay: {
      fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
      fontStyle: 'normal',
      fontSize: 96,
      lineHeight: '128px',
      fontWeight: 700,

      // example to make it responsive:
      // [themeBase.breakpoints.up('sm')]: {
      //   fontSize: 120,
      //   lineHeight: '140px',
      //   fontWeight: 700,
      //   letterSpacing: -1,
      // },
    },
    lifiHeaderXLarge: {
      fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '64px',
      lineHeight: '96px',
    },
    lifiHeaderLarge: {
      fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '48px',
      lineHeight: '64px',
    },
    lifiHeaderMedium: {
      fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '32px',
      lineHeight: '40px',
    },
    lifiHeaderSmall: {
      fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '18px',
      lineHeight: '24px',
    },
    lifiHeaderXSmall: {
      fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: '20px',
    },
    lifiBodyXLargeStrong: {
      fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: '24px',
      lineHeight: '32px',
    },
    lifiBodyXLarge: {
      fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '24px',
      lineHeight: '32px',
    },
    lifiBodyLargeStrong: {
      fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '18px',
      lineHeight: '24px',
    },
    lifiBodyLarge: {
      fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '18px',
      lineHeight: '24px',
    },
    lifiBodyMediumStrong: {
      fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '16px',
      lineHeight: '20px',
    },
    lifiBodyMedium: {
      fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '20px',
    },
    lifiBodySmallStrong: {
      fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: '20px',
    },
    lifiBodySmall: {
      fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '20px',
    },
    lifiBodyXSmallStrong: {
      fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
      fontStyle: 'normal',
      fontWeight: 700,
      fontSize: '12px',
      lineHeight: '16px',
    },
    lifiBodyXSmall: {
      fontFamily: ['Inter', 'Arial', 'sans-serif'].join(','),
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '12px',
      lineHeight: '16px',
    },
    lifiMono5: {
      fontFamily: 'Roboto Mono',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '21px',
    },
    lifiMono4: {
      fontFamily: 'Roboto Mono',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '18px',
    },
    lifiMono3: {
      fontFamily: 'Roboto Mono',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '12px',
      lineHeight: '16px',
    },
    lifiMono2: {
      fontFamily: 'Roboto Mono',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '10px',
      lineHeight: '13px',
    },
    lifiMono1: {
      fontFamily: 'Roboto Mono',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '8px',
      lineHeight: '11px',
    },
  },
});

const themePreset: Theme = createTheme(
  deepmerge(themeBase, themeTypographyPreset),
);

export const lightTheme: Theme = createTheme(
  deepmerge(themePreset, {
    palette: {
      mode: 'light',
      background: {
        default:
          'linear-gradient(180deg, #F9F5FF 0%, #F3EBFF 49.48%, #F9F5FF 99.48%)',
      },
      text: {
        primary: '#000',
      },
      bg: {
        light: '#F3EBFF',
        main: '#F3EBFF',
        dark: '#F3EBFF',
        // contrastText: '#fff',
      },
      accent1: {
        light: '#31007A',
        main: '#31007A',
        dark: '#31007A',
        // contrastText: '#fff',
      },
      accent2: {
        light: '#8700B8',
        main: '#8700B8',
        dark: '#8700B8',
        // contrastText: '#fff',
      },
    },
  }),
);

export const darkTheme: Theme = createTheme(
  deepmerge(themePreset, {
    palette: {
      mode: 'dark',
      background: {
        default:
          'linear-gradient(180deg, #000000 0%, #0C001F 49.48%, #000000 99.48%)', //'#241D52',
      },
      text: {
        primary: '#fff',
      },
      bg: {
        light: '#0E0B1F',
        main: '#030014', //#030014;
        dark: '#030014',
        // contrastText: '#fff',
      },
      accent1: {
        light: '#835FB8',
        main: '#835FB8',
        dark: '#835FB8',
        // contrastText: '#fff',
      },
      accent2: {
        light: '#D35CFF',
        main: '#D35CFF',
        dark: '#D35CFF',
        // contrastText: '#fff',
      },
    },
  }),
);
