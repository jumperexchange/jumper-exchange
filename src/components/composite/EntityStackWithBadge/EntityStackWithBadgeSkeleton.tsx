import type { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import type { FC } from 'react';
import { EntityStackContainer } from './EntityStackWithBadge.styles';
import { TitleWithHintSkeleton } from '../TitleWithHint/TitleWithHintSkeleton';
import { AvatarSkeleton } from '@/components/core/AvatarStack/AvatarStack.styles';

interface EntityStackWithBadgeSkeletonProps {
  size?: AvatarSize;
  gap?: number;
  isContentVisible?: boolean;
}

export const EntityStackWithBadgeSkeleton: FC<
  EntityStackWithBadgeSkeletonProps
> = ({ gap, size, isContentVisible }) => {
  return (
    <EntityStackContainer sx={{ gap }} isContentVisible={isContentVisible}>
      <AvatarSkeleton size={size} variant="circular" />
      {isContentVisible && <TitleWithHintSkeleton />}
    </EntityStackContainer>
  );
};
