'use client';

import { useBalancesFiltering } from '../../../../filtering/BalancesFilteringContext';
import { Badge } from '@/components/Badge/Badge';
import { BadgeVariant, BadgeSize } from '@/components/Badge/Badge.styles';
import { usePortfolioState } from '../../../../PortfolioContext';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

export const PortfolioFilterBarBalancesLastUpdatedBadge = () => {
  const { t } = useTranslation();
  const { isLoading } = useBalancesFiltering();
  const state = usePortfolioState();
  const updatedAt = state.sources.balances.updatedAt;

  if (!updatedAt || isLoading) {
    return null;
  }
  return (
    <Badge
      variant={BadgeVariant.Secondary}
      size={BadgeSize.SM}
      label={t('badge.updated', { time: formatDistanceToNow(updatedAt) })}
    />
  );
};
