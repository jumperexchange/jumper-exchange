import type { Theme } from '@mui/material/styles';

export const MODAL_CONTAINER_ID = 'request-redeem-modal';
export const BOTTOM_SHEET_TOP_OFFSET = 24;
export const ANIMATION_DURATION_SECONDS = 0.3;
export const ANIMATION_DURATION_MS = ANIMATION_DURATION_SECONDS * 1_000;

export const claimTokenAmountStyle = {
  background: 'transparent',
  boxShadow: 'none',
  padding: 0,
} as const;

export const widgetStyle = {
  container: (theme: Theme) => ({
    maxHeight: 'calc(100vh - 6rem)',
    position: 'relative',
    borderRadius: `${theme.shape.cardBorderRadiusLarge}px`,
  }),
  mainView: (theme: Theme) => ({
    padding: 0,
    width: 'calc(100vw - 2rem)',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: { width: 400 },
  }),
  mainViewContent: () => ({
    maxHeight: 'calc(100vh - 12rem)',
    display: 'flex',
    overflow: 'hidden',
  }),
  sideView: (theme: Theme) => ({}),
} as const;
