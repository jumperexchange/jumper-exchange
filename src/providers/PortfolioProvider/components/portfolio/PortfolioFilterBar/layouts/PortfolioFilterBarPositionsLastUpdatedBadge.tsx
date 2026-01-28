'use client';

import { usePositionsFiltering } from '../../../../filtering/PositionsFilteringContext';
import { Badge } from '@/components/Badge/Badge';
import { BadgeVariant, BadgeSize } from '@/components/Badge/Badge.styles';
import { usePortfolioState } from '@/providers/PortfolioProvider/PortfolioContext';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

export const PortfolioFilterBarPositionsLastUpdatedBadge = () => {
  const { t } = useTranslation();
  const { isLoading } = usePositionsFiltering();
  const state = usePortfolioState();
  const updatedAt = state.sources.positions.updatedAt;

  if (!updatedAt || isLoading) {
    return null;
  }
  return (
    <Badge
      variant={BadgeVariant.Secondary}
      size={BadgeSize.SM}
      label={t('badge.updated', {
        time: formatDistanceToNow(updatedAt),
      })}
    />
  );
};
