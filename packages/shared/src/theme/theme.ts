import { createTheme, Theme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import React from 'react';
import Fonts from '../fonts/fonts';
import { bodyStyled, resetStyled, viewports } from '../style';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
    accent1: Palette['primary'];
    accent2: Palette['primary'];
    white: Palette['primary'];
    black: Palette['primary'];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
    accent1?: PaletteOptions['primary'];
    accent2?: PaletteOptions['primary'];
    white?: PaletteOptions['primary'];
    black?: PaletteOptions['primary'];
  }
  interface TypographyVariants {
    hero: React.CSSProperties;
    subtitleL: React.CSSProperties;
    subtitleM: React.CSSProperties;
    subtitleS: React.CSSProperties;
    buttonL: React.CSSProperties;
    buttonM: React.CSSProperties;
    captionM: React.CSSProperties;
    captionS: React.CSSProperties;
    bodyRegularL: React.CSSProperties;
    bodyRegularM: React.CSSProperties;
    bodyRegularS: React.CSSProperties;
    bodyRegularXS: React.CSSProperties;
    bodyRegularXXS: React.CSSProperties;
    bodyMediumL: React.CSSProperties;
    bodyMediumM: React.CSSProperties;
    bodyMediumS: React.CSSProperties;
    bodyMediumXS: React.CSSProperties;
    bodyMediumXXS: React.CSSProperties;
    bodyBoldL: React.CSSProperties;
    bodyBoldM: React.CSSProperties;
    bodyBoldS: React.CSSProperties;
    bodyBoldXS: React.CSSProperties;
    bodyBoldXXS: React.CSSProperties;
    bodyLinkL: React.CSSProperties;
    bodyLinkM: React.CSSProperties;
    bodyLinkS: React.CSSProperties;
    bodyLinkXS: React.CSSProperties;
    bodyLinkXXS: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    hero?: React.CSSProperties;
    subtitleL?: React.CSSProperties;
    subtitleM?: React.CSSProperties;
    subtitleS?: React.CSSProperties;
    buttonL?: React.CSSProperties;
    buttonM?: React.CSSProperties;
    captionM?: React.CSSProperties;
    captionS?: React.CSSProperties;
    bodyRegularL?: React.CSSProperties;
    bodyRegularM?: React.CSSProperties;
    bodyRegularS?: React.CSSProperties;
    bodyRegularXS?: React.CSSProperties;
    bodyRegularXXS?: React.CSSProperties;
    bodyMediumL?: React.CSSProperties;
    bodyMediumM?: React.CSSProperties;
    bodyMediumS?: React.CSSProperties;
    bodyMediumXS?: React.CSSProperties;
    bodyMediumXXS?: React.CSSProperties;
    bodyBoldL?: React.CSSProperties;
    bodyBoldM?: React.CSSProperties;
    bodyBoldS?: React.CSSProperties;
    bodyBoldXS?: React.CSSProperties;
    bodyBoldXXS?: React.CSSProperties;
    bodyLinkL?: React.CSSProperties;
    bodyLinkM?: React.CSSProperties;
    bodyLinkS?: React.CSSProperties;
    bodyLinkXS?: React.CSSProperties;
    bodyLinkXXS?: React.CSSProperties;
  }
}
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    tertiary: true;
    accent1: true;
    accent2: true;
    white: true;
    black: true;
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    hero: true;
    subtitleL: true;
    subtitleM: true;
    subtitleS: true;
    buttonL: true;
    buttonM: true;
    captionM: true;
    captionS: true;
    bodyRegularL: true;
    bodyRegularM: true;
    bodyRegularS: true;
    bodyRegularXS: true;
    bodyRegularXXS: true;
    bodyMediumL: true;
    bodyMediumM: true;
    bodyMediumS: true;
    bodyMediumXS: true;
    bodyMediumXXS: true;
    bodyBoldL: true;
    bodyBoldM: true;
    bodyBoldS: true;
    bodyBoldXS: true;
    bodyBoldXXS: true;
    bodyLinkL: true;
    bodyLinkM: true;
    bodyLinkS: true;
    bodyLinkXS: true;
    bodyLinkXXS: true;
    subtitle1: false;
    subtitle2: false;
    body1: false;
    body2: false;
    button: false;
    caption: false;
  }
}

const themeBase: Theme = createTheme({
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          hero: 'div',
          h1: 'h2',
          h2: 'h2',
          h3: 'h3',
          h4: 'h4',
          h5: 'h5',
          h6: 'h6',
          subtitleL: 'div',
          subtitleM: 'div',
          subtitleS: 'div',
          buttonL: 'button',
          buttonM: 'button',
          captionM: 'p',
          captionS: 'p',
          bodyRegularL: 'p',
          bodyRegularM: 'p',
          bodyRegularS: 'p',
          bodyRegularXS: 'p',
          bodyRegularXXS: 'p',
          bodyMediumL: 'p',
          bodyMediumM: 'p',
          bodyMediumS: 'p',
          bodyMediumXS: 'p',
          bodyMediumXXS: 'p',
          bodyBoldL: 'p',
          bodyBoldM: 'p',
          bodyBoldS: 'p',
          bodyBoldXS: 'p',
          bodyBoldXXS: 'p',
          bodyLinkL: 'a',
          bodyLinkM: 'a',
          bodyLinkS: 'a',
          bodyLinkXS: 'a',
          bodyLinkXXS: 'a',
        },
      },
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

const themeTypographyPreset: Theme = createTheme({
  ...themeBase,
  typography: {
    fontFamily: ['"Inter"', 'Arial', 'sans-serif'].join(','),
    hero: {
      fontFamily: 'GalanoGrotesque, Arial',
      fontSize: 50,
      lineHeight: '58px',
      fontWeight: 700,
      [themeBase.breakpoints.up('sm')]: {
        fontSize: 76,
        lineHeight: '84px',
        fontWeight: 400,
        letterSpacing: -1,
      },
    },
    h1: {
      fontFamily: 'GalanoGrotesque, serif',
      fontSize: 42,
      lineHeight: '50px',
      fontWeight: 700,
      [themeBase.breakpoints.up('sm')]: {
        fontSize: 68,
        lineHeight: '74px',
        fontWeight: 600,
      },
    },
    h2: {
      fontFamily: 'Inter, monospace',
      fontSize: 36,
      lineHeight: '44px',
      fontWeight: 700,
      [themeBase.breakpoints.up('sm')]: {
        fontSize: 54,
        lineHeight: '64px',
        fontWeight: 600,
      },
    },
    h3: {
      fontSize: 32,
      lineHeight: '42px',
      fontWeight: 700,
      [themeBase.breakpoints.up('sm')]: {
        fontSize: 48,
        lineHeight: '70px',
        fontWeight: 400,
      },
    },
    h4: {
      fontSize: 27,
      lineHeight: '36px',
      fontWeight: 700,
      [themeBase.breakpoints.up('sm')]: {
        fontSize: 32,
        lineHeight: '40px',
        fontWeight: 400,
      },
    },
    h5: {
      fontSize: 22,
      lineHeight: '30px',
      fontWeight: 700,
      [themeBase.breakpoints.up('sm')]: {
        fontSize: 24,
        lineHeight: '34px',
        fontWeight: 400,
      },
    },
    h6: {
      fontSize: 20,
      lineHeight: '26px',
      fontWeight: 700,
      [themeBase.breakpoints.up('sm')]: {
        fontSize: 20,
        lineHeight: '28px',
        fontWeight: 400,
      },
    },
    subtitleL: {
      fontFamily: 'Inter',
      fontSize: 22,
      lineHeight: '42px',
      fontWeight: 300,
      letterSpacing: 0.4,
    },
    subtitleM: {
      fontSize: 20,
      lineHeight: '36px',
      fontWeight: 400,
      letterSpacing: 0.6,
    },
    subtitleS: {
      fontSize: 18,
      lineHeight: '34px',
      fontWeight: 300,
      letterSpacing: 0.2,
    },
    buttonM: {
      fontFamily: 'Inter',
      fontSize: 15,
      lineHeight: '20px',
      fontWeight: 500,
    },
    buttonL: {
      fontFamily: 'Inter',
      fontSize: 16,
      lineHeight: '20px',
      fontWeight: 500,
    },
    captionM: {
      fontFamily: 'Roboto Mono',
      fontSize: 14,
      lineHeight: '16px',
      fontWeight: 400,
    },
    captionS: {
      fontFamily: 'Roboto Mono',
      fontSize: 12,
      lineHeight: '16px',
      fontWeight: 400,
    },
    bodyRegularL: {
      fontFamily: 'Inter',
      fontSize: 17,
      lineHeight: '28px',
      fontWeight: 400,
    },
    bodyRegularM: {
      fontFamily: 'Inter',
      fontSize: 16,
      lineHeight: '28px',
      fontWeight: 400,
      letterSpacing: 0.2,
    },
    bodyRegularS: {
      fontFamily: 'Inter',
      fontSize: 14,
      lineHeight: '22px',
      fontWeight: 400,
      letterSpacing: 0.2,
    },
    bodyRegularXS: {
      fontFamily: 'Inter',
      fontSize: 13,
      lineHeight: '20px',
      fontWeight: 400,
      letterSpacing: -0.1,
    },
    bodyRegularXXS: {
      fontFamily: 'Inter',
      fontSize: 12,
      lineHeight: '16px',
      fontWeight: 400,
      letterSpacing: -0.1,
    },
    bodyMediumL: {
      fontFamily: 'Inter',
      fontSize: 17,
      lineHeight: '28px',
      fontWeight: 500,
    },
    bodyMediumM: {
      fontFamily: 'Inter',
      fontSize: 16,
      lineHeight: '28px',
      fontWeight: 500,
      letterSpacing: 0.2,
    },
    bodyMediumS: {
      fontFamily: 'Inter',
      fontSize: 14,
      lineHeight: '22px',
      fontWeight: 500,
    },
    bodyMediumXS: {
      fontFamily: 'Inter',
      fontSize: 13,
      lineHeight: '20px',
      fontWeight: 500,
      letterSpacing: -0.1,
    },
    bodyMediumXXS: {
      fontFamily: 'Inter',
      fontSize: 12,
      lineHeight: '16px',
      fontWeight: 500,
      letterSpacing: -0.1,
    },
    bodyBoldL: {
      fontFamily: 'Inter',
      fontSize: 17,
      lineHeight: '28px',
      fontWeight: 700,
    },
    bodyBoldM: {
      fontFamily: 'Inter',
      fontSize: 16,
      lineHeight: '28px',
      fontWeight: 700,
      letterSpacing: 0.2,
    },
    bodyBoldS: {
      fontFamily: 'Inter',
      fontSize: 14,
      lineHeight: '22px',
      fontWeight: 700,
    },
    bodyBoldXS: {
      fontFamily: 'Inter',
      fontSize: 13,
      lineHeight: '20px',
      fontWeight: 700,
    },
    bodyBoldXXS: {
      fontFamily: 'Inter',
      fontSize: 12,
      lineHeight: '16px',
      fontWeight: 700,
    },
    bodyLinkL: {
      fontFamily: 'Inter',
      fontSize: 17,
      lineHeight: '28px',
      fontWeight: 400,
    },
    bodyLinkM: {
      fontFamily: 'Inter',
      fontSize: 16,
      lineHeight: '28px',
      fontWeight: 400,
    },
    bodyLinkS: {
      fontFamily: 'Inter',
      fontSize: 14,
      lineHeight: '22px',
      fontWeight: 400,
    },
    bodyLinkXS: {
      fontFamily: 'Inter',
      fontSize: 13,
      lineHeight: '20px',
      fontWeight: 400,
      letterSpacing: -0.1,
    },
    bodyLinkXXS: {
      fontFamily: 'Inter',
      fontSize: 12,
      lineHeight: '16px',
      fontWeight: 400,
      letterSpacing: -0.1,
    },
  },
});

const themePreset: Theme = createTheme(
  deepmerge(themeBase, themeTypographyPreset),
);

export const lightTheme: Theme = createTheme(
  deepmerge(themePreset, {
    spacing: 4,
    palette: {
      mode: 'light',
      background: {
        default:
          'linear-gradient(180deg, #F9F5FF 0%, #F3EBFF 49.48%, #F9F5FF 99.48%)',
      },
      text: {
        primary: '#000',
      },
      accent1: {
        light: '#31007A',
        main: '#31007A',
        dark: '#31007A',
        contrastText: '#fff',
      },
      accent2: {
        light: '#8700B8',
        main: '#8700B8',
        dark: '#8700B8',
        contrastText: '#fff',
      },
      primary: {
        light: '#31007A',
        main: '#31007A',
        dark: '#31007A',
        contrastText: '#fff',
      },
      secondary: {
        light: '#eee6f5',
        main: '#eee6f5',
        dark: '#eee6f5',
        contrastText: '#fff',
      },
      tertiary: {
        light: '#f5e7fa',
        main: '#f5e7fa',
        dark: '#f5e7fa',
        contrastText: '#fff',
      },
      grey: {
        100: '#FFFFFF',
        200: '#F6F5FA',
        300: '#ECEBF0',
        400: '#DDDCE0',
        500: '#C9C8CC',
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
      warning: {
        main: '#FFE668',
        light: '#FFE668',
        dark: '#FFE668',
      },
      error: {
        main: '#E5452F',
        light: '#E5452F',
        dark: '#E5452F',
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
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: `${resetStyled} ${bodyStyled} ${Fonts}`,
      },
    },
  }),
);

export const darkTheme: Theme = createTheme(
  deepmerge(themePreset, {
    spacing: 4,
    palette: {
      mode: 'dark',
      background: {
        default:
          'linear-gradient(180deg, #000000 0%, #0C001F 49.48%, #000000 99.48%)', //'#241D52',
      },
      text: {
        primary: '#fff',
      },
      accent1: {
        light: '#653BA3',
        main: '#653BA3',
        dark: '#653BA3',
        contrastText: '#fff',
      },
      accent2: {
        light: '#B24DD6',
        main: '#B24DD6',
        dark: '#B24DD6',
        contrastText: '#fff',
      },
      primary: {
        light: '#31007A',
        main: '#31007A',
        dark: '#31007A',
        contrastText: '#fff',
      },
      secondary: {
        light: '#eee6f5',
        main: '#eee6f5',
        dark: '#eee6f5',
        contrastText: '#fff',
      },
      tertiary: {
        light: '#f5e7fa',
        main: '#f5e7fa',
        dark: '#f5e7fa',
        contrastText: '#fff',
      },
      grey: {
        100: '#FFFFFF',
        200: '#F6F5FA',
        300: '#ECEBF0',
        400: '#DDDCE0',
        500: '#C9C8CC',
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
      warning: {
        main: '#FFE668',
        light: '#FFE668',
        dark: '#FFE668',
      },
      error: {
        main: '#E5452F',
        light: '#E5452F',
        dark: '#E5452F',
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
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: `${resetStyled} ${bodyStyled} ${Fonts}`,
      },
    },
  }),
);
