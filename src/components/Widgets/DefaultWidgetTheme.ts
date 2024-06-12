import { useTheme } from '@mui/material';
import { darkTheme } from 'src/theme';

export const DefaultWidgetTheme = () => {
  const theme = useTheme();

  return {
    typography: {
      fontFamily: theme.typography.fontFamily,
      lifiBrandHeaderXLarge: {
        fontFamily: theme.typography.fontFamily,
        fontSize: '32px',
        fontWeight: 700,
        lineHeight: '40px',
      },
      lifiBodyXLarge: {
        fontFamily: theme.typography.fontFamily,
        fontSize: '20px',
        fontWeight: 400,
        lineHeight: '28px',
      },
      lifiBodyLargeStrong: {
        fontFamily: theme.typography.fontFamily,
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: '24px',
      },
      lifiBodyLarge: {
        fontFamily: theme.typography.fontFamily,
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '24px',
      },

      lifiBodySmall: {
        fontFamily: theme.typography.fontFamily,
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '16px',
      },
    },
    container: {
      borderRadius: '12px',
      minWidth: 416,
      boxShadow:
        theme.palette.mode === 'light'
          ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
          : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
    },
    shape: {
      borderRadius: 12,
      borderRadiusSecondary: 24,
    },
    palette: {
      background: {
        paper: theme.palette.surface2.main,
        default: theme.palette.surface1.main,
      },
      primary: {
        main: theme.palette.accent1.main,
      },
      secondary: {
        main: darkTheme.palette.accent2.main,
      },
      grey: theme.palette.grey,
    },
  };
};
