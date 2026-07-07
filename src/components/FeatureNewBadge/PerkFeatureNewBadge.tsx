import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BadgeSize } from '@/components/Badge/Badge.styles';
import { useFeatureBadgeDisplay } from '@/hooks/featureBadge/useFeatureBadgeDisplay';
import type { FeatureBadgeData } from '@/types/strapi';
import { FeatureNewBadge } from './FeatureNewBadge';

interface PerkFeatureNewBadgeProps {
  featureBadge: FeatureBadgeData;
  firstPublishedAt?: string | null;
}

/**
 * Renders the badge for a perk card by combining the shared feature-badge
 * config with the perk's own FirstPublishedAt reference date.
 * Extracted as a component so the hook call is always unconditional.
 */
export const PerkFeatureNewBadge: FC<PerkFeatureNewBadgeProps> = ({
  featureBadge,
  firstPublishedAt,
}) => {
  const { t } = useTranslation();
  const { isVisible, label, variant, size } = useFeatureBadgeDisplay({
    expiryMode: featureBadge.ExpiryMode,
    showBadge: featureBadge.ShowBadge,
    badgeExpiresAt: featureBadge.BadgeExpiresAt,
    durationDays: featureBadge.DurationDays,
    badgeLabel: featureBadge.BadgeLabel,
    badgeVariant: featureBadge.BadgeVariant,
    badgeSize: featureBadge.BadgeSize,
    referenceDate: firstPublishedAt,
    defaultLabel: t('badge.recentlyAdded'),
  });

  if (!isVisible) {
    return null;
  }

  return (
    <FeatureNewBadge
      label={label}
      variant={variant}
      size={size ?? BadgeSize.SM}
    />
  );
};
