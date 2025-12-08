import { usePortfolioTokensFiltering } from '@/app/ui/portfolio/PortfolioTokensFilteringContext';
import { Badge } from '@/components/Badge/Badge';
import { BadgeVariant, BadgeSize } from '@/components/Badge/Badge.styles';
import { useTokensLastState } from '@/hooks/portfolio/useTokensLastState';
import { formatDistanceToNow } from 'date-fns';

export const PortfolioFilterBarTokensLastUpdatedBadge = () => {
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
      // TODO: i18n date:
      label={`Updated ${formatDistanceToNow(updatedAt)} ago`}
    />
  );
};
