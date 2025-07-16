import { FC } from 'react';
import { EntityCardProps } from './EntityCard.types';
import { CompactEntityCard } from './variants/CompactEntityCard';
import { WideEntityCard } from './variants/WideEntityCard';

export const EntityCard: FC<EntityCardProps> = ({
  variant = 'compact',
  ...rest
}) => {
  if (variant === 'compact') {
    return <CompactEntityCard {...rest} />;
  }

  return <WideEntityCard {...rest} />;
};
