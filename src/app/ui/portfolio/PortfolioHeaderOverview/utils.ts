import type { TFunction } from 'i18next';
import type { Theme } from '@mui/material/styles';

export const getPnlColor = (pnlValue: number | null, theme: Theme): string => {
  const palette = (theme.vars || theme).palette;
  if (pnlValue == null) {
    return palette.text.secondary;
  }
  if (pnlValue > 0) {
    return palette.statusSuccess;
  }
  if (pnlValue < 0) {
    return palette.statusError;
  }
  return palette.text.secondary;
};

export const formatPnl = (
  pnlValue: number | null,
  pnlPercentage: number | null,
  t: TFunction,
): string => {
  const amount = t('format.currencyCompact', {
    value: pnlValue ?? 0,
  });
  const pct = t('format.percent', { value: (pnlPercentage ?? 0) / 100 });
  return `${pct} • ${amount}`;
};
