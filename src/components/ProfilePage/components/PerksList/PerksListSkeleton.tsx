import { FC } from 'react';
import { PerksCardSkeleton } from 'src/components/Cards/PerksCard/PerksCardSkeleton';

interface PerksListSkeletonProps {
  count?: number;
}

export const PerksListSkeleton: FC<PerksListSkeletonProps> = ({
  count = 2,
}) => {
  return Array.from({ length: count }, (_, index) => (
    <PerksCardSkeleton key={index} />
  ));
};
