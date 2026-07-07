import { useMemo } from 'react';
import { differenceInDays, isAfter, parseISO } from 'date-fns';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';

export interface FeatureBadgeConfig {
  expiryMode?: 'fixed_date' | 'rolling_window' | null;
  showBadge?: boolean | null;
  badgeExpiresAt?: string | null;
  durationDays?: number | null;
  badgeLabel?: string | null;
  badgeVariant?: string | null;
  badgeSize?: string | null;
  referenceDate?: string | null;
  defaultLabel?: string;
}

export interface FeatureBadgeResult {
  isVisible: boolean;
  label: string;
  variant: BadgeVariant;
  size: BadgeSize;
}

const BADGE_VARIANT_VALUES = Object.values(BadgeVariant) as string[];
const BADGE_SIZE_VALUES = Object.values(BadgeSize) as string[];

function resolveVariant(value: string | null | undefined): BadgeVariant {
  if (value && BADGE_VARIANT_VALUES.includes(value)) {
    return value as BadgeVariant;
  }
  return BadgeVariant.Error;
}

function resolveSize(value: string | null | undefined): BadgeSize {
  if (value && BADGE_SIZE_VALUES.includes(value)) {
    return value as BadgeSize;
  }
  return BadgeSize.SM;
}

export const useFeatureBadge = (
  config: FeatureBadgeConfig,
): FeatureBadgeResult => {
  const {
    expiryMode,
    showBadge,
    badgeExpiresAt,
    durationDays,
    badgeLabel,
    badgeVariant,
    badgeSize,
    referenceDate,
    defaultLabel = 'NEW',
  } = config;

  return useMemo(() => {
    const variant = resolveVariant(badgeVariant);
    const size = resolveSize(badgeSize);
    const label = badgeLabel ?? defaultLabel;

    // Force hide — beats everything
    if (showBadge === false) {
      return { isVisible: false, label, variant, size };
    }

    // Auto: fixed-date window
    if (expiryMode === 'fixed_date' && badgeExpiresAt) {
      const expiresAt = parseISO(badgeExpiresAt);
      return {
        isVisible: !isAfter(new Date(), expiresAt),
        label,
        variant,
        size,
      };
    }

    // Auto: rolling window
    if (
      expiryMode === 'rolling_window' &&
      referenceDate &&
      durationDays != null
    ) {
      const daysSince = differenceInDays(new Date(), parseISO(referenceDate));
      return { isVisible: daysSince < durationDays, label, variant, size };
    }

    // Force show — beats date logic
    if (showBadge === true) {
      return { isVisible: true, label, variant, size };
    }

    return { isVisible: false, label, variant, size };
  }, [
    expiryMode,
    showBadge,
    badgeExpiresAt,
    durationDays,
    badgeLabel,
    badgeVariant,
    badgeSize,
    referenceDate,
    defaultLabel,
  ]);
};
