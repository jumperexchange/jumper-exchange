import { FC } from 'react';
import { EarnCardProps } from './EarnCard.types';
import { CompactEarnCard } from './variants/CompactEarnCard';
import { ListItemEarnCard } from './variants/ListItemEarnCard';
import { OverviewEarnCard } from './variants/OverviewEarnCard';

export const EarnCard: FC<EarnCardProps> = ({
  variant = 'compact',
  ...rest
}) => {
  if (variant === 'list-item') {
    return <ListItemEarnCard {...rest} />;
  }
  if (variant === 'overview') {
    return <OverviewEarnCard {...rest} />;
  }
  return <CompactEarnCard {...rest} />;
};
