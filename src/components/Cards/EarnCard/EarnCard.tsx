import { FC } from 'react';
import { EarnCardProps } from './EarnCard.types';
import { CompactEarnCard } from './variants/CompactEarnCard';
import { ListItemEarnCard } from './variants/ListItemEarnCard';

export const EarnCard: FC<EarnCardProps> = ({
  variant = 'compact',
  ...rest
}) => {
  if (variant === 'list-item') {
    return <ListItemEarnCard {...rest} />;
  }
  return <CompactEarnCard {...rest} />;
};
