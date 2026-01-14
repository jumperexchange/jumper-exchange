import { usePortfolioDeFiPositionsFiltering } from '@/app/ui/portfolio/PortfolioDeFiPositionsFilteringContext';
import { Badge } from '@/components/Badge/Badge';
import { BadgeVariant, BadgeSize } from '@/components/Badge/Badge.styles';
import { useDeFiPositionsFiltering } from '@/providers/PortfolioProvider/filtering/DeFiPositionsFilteringContext';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

export const PortfolioFilterBarDeFiLastUpdatedBadge = () => {
  const { t } = useTranslation();
  const { isLoading, allDataUpdatedAt } = useDeFiPositionsFiltering();
  if (!allDataUpdatedAt || isLoading) {
    return null;
  }
  return (
    <Badge
      variant={BadgeVariant.Secondary}
      size={BadgeSize.SM}
      label={t('badge.updated', {
        time: formatDistanceToNow(allDataUpdatedAt),
      })}
    />
  );
};
