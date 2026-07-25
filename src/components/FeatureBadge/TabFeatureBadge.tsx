'use client';

import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { BadgeVariant } from '@/components/Badge/Badge.styles';
import { useFeatureBadge } from '@/hooks/featureBadge/useFeatureBadge';
import { FeatureBadgeView } from './FeatureBadgeView';

interface TabFeatureBadgeProps {
  featureKey: string;
  disabled?: boolean;
}

export const TabFeatureBadge: FC<TabFeatureBadgeProps> = ({
  featureKey,
  disabled,
}) => {
  const { t } = useTranslation();
  const { data } = useFeatureBadge(featureKey);

  if (!data) {
    return null;
  }

  return (
    <FeatureBadgeView
      featureBadge={data}
      defaultLabel={t('promo.new')}
      override={
        disabled
          ? {
              label: t('portfolio.views.soon'),
              variant: BadgeVariant.Secondary,
            }
          : undefined
      }
      sx={{
        position: 'absolute',
        top: -12,
        right: -12,
        zIndex: 1,
        pointerEvents: 'none',
        transform: 'scale(0.75)',
        transformOrigin: 'top right',
      }}
    />
  );
};
