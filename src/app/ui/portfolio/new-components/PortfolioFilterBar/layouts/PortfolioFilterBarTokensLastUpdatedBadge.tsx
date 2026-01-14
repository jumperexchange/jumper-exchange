import { Badge } from '@/components/Badge/Badge';
import { BadgeVariant, BadgeSize } from '@/components/Badge/Badge.styles';
import { useTokensFiltering } from '@/providers/PortfolioProvider/filtering/TokensFilteringContext';
import { useTokensData } from '@/providers/PortfolioProvider/hooks/useTokensData';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

export const PortfolioFilterBarTokensLastUpdatedBadge = () => {
  const { t } = useTranslation();
  const { isLoading } = useTokensFiltering();
  const { updatedAt } = useTokensData();
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
