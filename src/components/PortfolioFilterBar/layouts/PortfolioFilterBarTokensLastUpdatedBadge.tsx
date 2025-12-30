import { usePortfolioTokensFiltering } from '@/app/ui/portfolio/PortfolioTokensFilteringContext';
import { Badge } from '@/components/Badge/Badge';
import { BadgeVariant, BadgeSize } from '@/components/Badge/Badge.styles';
import { useTokensLastState } from '@/hooks/portfolio/useTokensLastState';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
export const PortfolioFilterBarTokensLastUpdatedBadge = () => {
  const { t } = useTranslation();
  const { isLoading } = usePortfolioTokensFiltering();
  const lastTokensState = useTokensLastState();
  const updatedAt = lastTokensState?.date;
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
