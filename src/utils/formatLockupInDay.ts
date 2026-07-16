import type { TFunction } from 'i18next';

export const formatLockupInDay = (days: number, t: TFunction): string =>
  t('labels.lockupPeriodValue', { count: days });
