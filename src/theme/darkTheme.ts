import type { Theme } from '@mui/material';
import { alpha, createTheme, darken } from '@mui/material';
import { deepmerge } from '@mui/utils';
import { darkColors } from './darkColors';
import { themeCustomized, themePreset } from './theme';
import { buttonStyles } from './themeStyles';

export const darkTheme: Theme = createTheme(
  deepmerge(themePreset, {
    components: {
      MuiButton: {
        defaultProps: {
          size: 'large',
        },
        styleOverrides: {
          sizeSmall: {
            height: 32,
          },
          sizeMedium: {
            height: 40,
          },
          sizeLarge: {
            height: 48,
          },
          root: {
            borderRadius: '24px',
            fontSize: '16px',
            letterSpacing: 0,
            textTransform: 'none',
            fontWeight: 'bold',
            transition: 'background-color 250ms',
            overflow: 'hidden',
            color: themeCustomized.palette.white.main,
            backgroundColor: 'pink',
            '&:hover': {
              backgroundColor: darkColors.primary.main,
            },
          },
        },
        variants: [
          {
            props: (props: { variant: string }) => props.variant === 'primary',
            style: {
              ...buttonStyles,
              color: themeCustomized.palette.white.main,
              backgroundColor: darkColors.primary.main,
              ':hover': {
                backgroundColor: darken(darkColors.primary.main, 0.16),
              },
            },
          },
          {
            props: (props: { variant: string }) =>
              props.variant === 'secondary',
            style: {
              ...buttonStyles,
              color: themeCustomized.palette.white.main,
              backgroundColor: alpha(darkColors.primary.main, 0.42),
              '&:hover': {
                backgroundColor: alpha(darkColors.primary.main, 0.56),
              },
            },
          },
          {
            props: (props: { variant: string }) =>
              props.variant === 'transparent',
            style: {
              ...buttonStyles,
              color: themeCustomized.palette.white.main,
              backgroundColor: alpha(themeCustomized.palette.white.main, 0.12),
              '&:hover': {
                backgroundColor: alpha(
                  themeCustomized.palette.white.main,
                  0.16,
                ),
              },
              '&:before': {
                content: '" "',
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                transition: 'background 250ms',
                background: 'transparent',
              },
              '&:hover:before': {
                background: 'rgb(255 255 255 / 4%)',
              },
            },
          },
        ],
      },
    },
    palette: {
      mode: 'dark',
      background: {
        default:
          'linear-gradient(180deg, #000000 0%, #0C001F 49.48%, #000000 99.48%)', //'#241D52',
      },
      text: {
        primary: '#fff',
      },
      grey: {
        800: '#302B52',
      },
      bg: {
        light: darkColors.bg.light,
        main: darkColors.bg.main,
        dark: darkColors.bg.dark,
      },
      shadow: {
        light: darkColors.shadow.light,
        main: darkColors.shadow.main,
        dark: darkColors.shadow.dark,
      },
      primary: {
        light: darkColors.primary.light,
        main: darkColors.primary.main,
        dark: darkColors.primary.dark,
      },
      secondary: {
        light: darkColors.secondary.light,
        main: darkColors.secondary.main,
        dark: darkColors.secondary.dark,
      },
      tertiary: {
        light: darkColors.tertiary.light,
        main: darkColors.tertiary.main,
        dark: darkColors.tertiary.dark,
      },
      accent1: {
        light: darkColors.accent1.light,
        main: darkColors.accent1.main,
        dark: darkColors.accent1.dark,
      },
      accent1Alt: {
        light: darkColors.accent1Alt.light,
        main: darkColors.accent1Alt.main,
        dark: darkColors.accent1Alt.dark,
      },
      accent2: {
        light: darkColors.accent2.light,
        main: darkColors.accent2.main,
        dark: darkColors.accent2.dark,
      },
      surface1: {
        light: darkColors.surface1.light,
        main: darkColors.surface1.main,
        dark: darkColors.surface1.dark,
      },
      surface2: {
        light: darkColors.surface2.light,
        main: darkColors.surface2.main,
        dark: darkColors.surface2.dark,
      },
      surface3: {
        light: darkColors.surface3.light,
        main: darkColors.surface3.main,
        dark: darkColors.surface3.dark,
      },
    },
  }),
);
