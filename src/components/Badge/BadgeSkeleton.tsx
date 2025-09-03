import { FC } from 'react';
import { BadgeSize, BaseSkeleton } from './Badge.styles';

interface BadgeSkeletonProps {
  size?: BadgeSize;
  width?: number;
}
export const BadgeSkeleton: FC<BadgeSkeletonProps> = ({ size, width }) => {
  return <BaseSkeleton variant="rectangular" size={size} width={width} />;
};
