import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { FeatureBadgeData } from '@/types/strapi';
import { FeatureBadgeView } from './FeatureBadgeView';

interface PerkFeatureBadgeProps {
  featureBadge: FeatureBadgeData;
  firstPublishedAt?: string | null;
}

export const PerkFeatureBadge: FC<PerkFeatureBadgeProps> = ({
  featureBadge,
  firstPublishedAt,
}) => {
  const { t } = useTranslation();

  return (
    <FeatureBadgeView
      featureBadge={featureBadge}
      referenceDate={firstPublishedAt}
      defaultLabel={t('badge.recentlyAdded')}
    />
  );
};
