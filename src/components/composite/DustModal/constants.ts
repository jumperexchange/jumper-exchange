import type { Theme } from '@mui/material/styles';

export const widgetStyle = {
  container: (theme: Theme) => ({
    maxHeight: 'calc(100vh - 6rem)',
    position: 'relative',
    borderRadius: `${theme.shape.cardBorderRadiusLarge}px`,
    // boxShadow: theme.shadows[3],
    maxWidth: 400,
    width: 400,
    [theme.breakpoints.up('sm')]: {
      width: 'fit-content',
      maxWidth: 'fit-content',
    },
  }),
  mainView: (theme: Theme) => ({
    padding: 0,
    width: 'calc(100vw - 2rem)',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'none',
    [theme.breakpoints.up('sm')]: { width: 400 },
  }),
  mainViewContent: () => ({
    maxHeight: 'calc(100vh - 12rem)',
    display: 'flex',
    overflow: 'hidden',
  }),
  sideView: (theme: Theme) => ({
    padding: 0,
    width: 'calc(100vw - 2rem)',
    maxWidth: 400,
    [theme.breakpoints.up('sm')]: { width: 256 },
  }),
} as const;
