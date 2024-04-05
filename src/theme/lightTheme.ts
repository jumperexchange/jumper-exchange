import type { Theme } from '@mui/material';
import { alpha, createTheme, darken } from '@mui/material';
import { deepmerge } from '@mui/utils';
import { darkColors } from './darkColors';
import { lightColors } from './lightColors';
import { themeCustomized, themePreset } from './theme';
import { buttonStyles } from './themeStyles';

export const lightTheme: Theme = createTheme(
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
            // backgroundColor: props.variant === 'primary' ? 'green' : 'pink',
            // color: theme.palette.black.main,
            // '&:hover': {
            //   backgroundColor: lightColors.accent1.main,
            // },
          },
        },
        variants: [
          {
            props: (props: { variant: string }) => props.variant === 'primary',
            style: {
              ...buttonStyles,
              color: themeCustomized.palette.white.main,
              backgroundColor: lightColors.accent1.main,
              ':hover': {
                backgroundColor: darken(lightColors.accent1.main, 0.16),
              },
            },
          },
          {
            props: (props: { variant: string }) =>
              props.variant === 'secondary',
            style: {
              ...buttonStyles,
              color: themeCustomized.palette.black.main,
              backgroundColor: alpha(darkColors.primary.main, 0.08),
              '&:hover': {
                backgroundColor: alpha(darkColors.primary.main, 0.12),
              },
            },
          },
          {
            props: (props: { variant: string }) =>
              props.variant === 'transparent',
            style: {
              ...buttonStyles,
              color: themeCustomized.palette.black.main,
              backgroundColor: alpha(themeCustomized.palette.black.main, 0.08),
              '&:hover': {
                backgroundColor: alpha(
                  themeCustomized.palette.black.main,
                  0.12,
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
                background: 'rgb(0 0 0 / 4%)',
              },
            },
          },
        ],
      },
    },
    palette: {
      mode: 'light',
      background: {
        default:
          'linear-gradient(180deg, #F9F5FF 0%, #F3EBFF 49.48%, #F9F5FF 99.48%)',
      },
      text: {
        primary: '#000',
      },
      grey: {
        300: '#E5E1EB',
      },
      bg: {
        light: lightColors.bg.light,
        main: lightColors.bg.main,
        dark: lightColors.bg.dark,
      },
      shadow: {
        light: lightColors.shadow.light,
        main: lightColors.shadow.main,
        dark: lightColors.shadow.dark,
      },
      primary: {
        light: lightColors.primary.light,
        main: lightColors.primary.main,
        dark: lightColors.primary.dark,
      },
      secondary: {
        light: lightColors.secondary.light,
        main: lightColors.secondary.main,
        dark: lightColors.secondary.dark,
      },
      tertiary: {
        light: lightColors.tertiary.light,
        main: lightColors.tertiary.main,
        dark: lightColors.tertiary.dark,
      },
      accent1: {
        light: lightColors.accent1.light,
        main: lightColors.accent1.main,
        dark: lightColors.accent1.dark,
      },
      accent2: {
        light: lightColors.accent2.light,
        main: lightColors.accent2.main,
        dark: lightColors.accent2.dark,
      },
      surface1: {
        light: lightColors.surface1.light,
        main: lightColors.surface1.main,
        dark: lightColors.surface1.dark,
      },
      surface2: {
        light: lightColors.surface2.light,
        main: lightColors.surface2.main,
        dark: lightColors.surface2.dark,
      },
      surface3: {
        light: lightColors.surface3.light,
        main: lightColors.surface3.main,
        dark: lightColors.surface3.dark,
      },
    },
  }),
);
