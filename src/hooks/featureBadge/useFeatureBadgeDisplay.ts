import { useMemo } from 'react';
import { differenceInDays, isAfter, isBefore, parseISO } from 'date-fns';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import type { StrapiBadgeComponent } from '@/types/strapi';
import { resolveStrapiMediaUrl } from '@/utils/strapi/strapiHelper';

export interface FeatureBadgeConfig {
  enabled?: boolean | null;
  launchAt?: string | null;
  expiryMode?: 'until_date' | 'days_after_launch' | null;
  expiresAt?: string | null;
  displayDaysAfterLaunch?: number | null;
  liveBadge: StrapiBadgeComponent;
  soonBadge?: StrapiBadgeComponent | null;
  referenceDate?: string | null;
  defaultLabel?: string;
}

export interface FeatureBadgeDisplayResult {
  isVisible: boolean;
  label: string;
  variant: BadgeVariant;
  size: BadgeSize;
  iconUrl: string | null;
}

const BADGE_VARIANT_VALUES = Object.values(BadgeVariant) as string[];
const BADGE_SIZE_VALUES = Object.values(BadgeSize) as string[];

function resolveVariant(value: BadgeVariant | null | undefined): BadgeVariant {
  if (value && BADGE_VARIANT_VALUES.includes(value)) {
    return value;
  }
  return BadgeVariant.New;
}

function resolveSize(value: BadgeSize | null | undefined): BadgeSize {
  if (value && BADGE_SIZE_VALUES.includes(value)) {
    return value;
  }
  return BadgeSize.SM;
}

function resolveBadge(badge: StrapiBadgeComponent, defaultLabel: string) {
  return {
    label: badge.Label || defaultLabel,
    variant: resolveVariant(badge.Variant),
    size: resolveSize(badge.Size),
    iconUrl: resolveStrapiMediaUrl(badge.Icon?.url) ?? null,
  };
}

export const useFeatureBadgeDisplay = (
  config: FeatureBadgeConfig,
): FeatureBadgeDisplayResult => {
  const {
    enabled,
    launchAt,
    expiryMode,
    expiresAt,
    displayDaysAfterLaunch,
    liveBadge,
    soonBadge,
    referenceDate,
    defaultLabel = 'NEW',
  } = config;

  return useMemo(() => {
    const live = resolveBadge(liveBadge, defaultLabel);
    const hidden = { ...live, isVisible: false };

    // Master switch — beats everything.
    if (enabled === false) {
      return hidden;
    }

    const now = new Date();

    // Before launch: show the Soon badge if configured, otherwise nothing.
    if (launchAt && isBefore(now, parseISO(launchAt))) {
      if (!soonBadge) {
        return hidden;
      }
      return { ...resolveBadge(soonBadge, defaultLabel), isVisible: true };
    }

    // Live window — check expiry.
    if (expiryMode === 'until_date') {
      if (expiresAt && isAfter(now, parseISO(expiresAt))) {
        return hidden;
      }
    } else if (expiryMode === 'days_after_launch') {
      const reference = launchAt ?? referenceDate;
      if (reference && displayDaysAfterLaunch != null) {
        const daysSince = differenceInDays(now, parseISO(reference));
        if (daysSince >= displayDaysAfterLaunch) {
          return hidden;
        }
      }
    }

    return { ...live, isVisible: true };
  }, [
    enabled,
    launchAt,
    expiryMode,
    expiresAt,
    displayDaysAfterLaunch,
    liveBadge,
    soonBadge,
    referenceDate,
    defaultLabel,
  ]);
};
