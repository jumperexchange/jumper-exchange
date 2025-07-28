import { FC } from 'react';
import { AchievementCardSkeleton } from 'src/components/Cards/AchievementCard/AchievementCardSkeleton';

interface AchievementsListSkeletonProps {
  count?: number;
}

export const AchievementsListSkeleton: FC<AchievementsListSkeletonProps> = ({
  count = 2,
}) => {
  return Array.from({ length: count }).map((_, index) => (
    <AchievementCardSkeleton key={index} />
  ));
};
