import type { Theme } from '@mui/material/styles';

export const getWidgetStickyTop = (
  headerHeightPx: number,
  theme: Theme,
): string => `calc(${headerHeightPx}px + ${theme.spacing(3.5)})`;
