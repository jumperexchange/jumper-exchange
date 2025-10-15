import { FC } from 'react';
import { BadgeSize, BaseSkeleton } from './Badge.styles';

interface BadgeSkeletonProps {
  size?: BadgeSize;
  width?: number;
  color?: 'default' | 'grey';
}
export const BadgeSkeleton: FC<BadgeSkeletonProps> = ({
  size,
  width,
  color = 'default',
}) => {
  return (
    <BaseSkeleton
      variant="rectangular"
      size={size}
      width={width}
      color={color}
    />
  );
};
