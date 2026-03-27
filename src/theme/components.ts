import type { Breakpoint, Theme } from '@mui/material/styles';
import { inter } from 'src/fonts/fonts';

export const createComponents = (themeBase: Theme) => ({
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
      root: () => ({
        '& .MuiTabs-scroller': {
          alignSelf: 'center',
        },
      }),
    },
  },
  MuiTab: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        display: 'flex',
        flexDirection: 'row' as const,
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
      root: ({ theme }: { theme: Theme }) => ({
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
      tooltip: ({ theme }: { theme: Theme }) => ({
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
        objectFit: 'contain' as const,
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
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
        margin: 0,
        padding: 0,
      },
      body: {
        minHeight: '100dvh',
        scrollBehavior: 'smooth',
        margin: 0,
        padding: 0,
      },
    },
  },
  MuiButton: {
    defaultProps: {
      size: 'large' as const,
    },
    styleOverrides: {
      root: {
        borderRadius: 24,
        textTransform: 'none' as const,
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
        bodySmallParagraph: 'p',
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
        position: 'fixed' as const,
        left: 0,
        bottom: 0,
        right: 0,
        top: 0,
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none' as const,
        backgroundColor: (theme.vars || theme).palette.bg.main,
        [theme.breakpoints.up('sm' as Breakpoint)]: {
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        },
      }),
    },
  },
});
