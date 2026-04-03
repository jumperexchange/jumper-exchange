import { memo, type FC } from 'react';
import type { EarnCardProps } from './EarnCard.types';
import { CompactEarnCard } from './variants/CompactEarnCard';
import { ListItemEarnCard } from './variants/ListItemEarnCard';
import { OverviewEarnCard } from './variants/OverviewEarnCard';

const EarnCardBase: FC<EarnCardProps> = ({ variant = 'compact', ...rest }) => {
  if (variant === 'list-item') {
    return <ListItemEarnCard {...rest} />;
  }
  if (variant === 'overview') {
    return <OverviewEarnCard {...rest} />;
  }
  return <CompactEarnCard {...rest} />;
};

export const EarnCard = memo(EarnCardBase, (prev, next) => {
  return (
    prev.variant === next.variant &&
    prev.data?.slug === next.data?.slug &&
    prev.isLoading === next.isLoading &&
    prev.isMissingPosition === next.isMissingPosition &&
    prev.href === next.href
  );
});
