import { FC } from 'react';
import { EarnCardProps } from './EarnCard.types';
import { CompactEarnCard } from './variants/CompactEarnCard';
import { ListItemEarnCard } from './variants/ListItemEarnCard';
import { TopEarnCard } from './variants/TopEarnCard';

export const EarnCard: FC<EarnCardProps> = ({
  variant = 'compact',
  ...rest
}) => {
  if (variant === 'list-item') {
    return <ListItemEarnCard {...rest} />;
  }
  if (variant === 'top') {
    return <TopEarnCard {...rest} />;
  }
  return <CompactEarnCard {...rest} />;
};
