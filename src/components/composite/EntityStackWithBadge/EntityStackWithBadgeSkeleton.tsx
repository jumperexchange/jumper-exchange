import {
  AvatarSkeleton,
  getCustomOverlayMask,
} from '@/components/core/AvatarStack/AvatarStack.styles';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import type { FC } from 'react';
import { TitleWithHintSkeleton } from '../TitleWithHint/TitleWithHintSkeleton';
import {
  BadgeStackWrapper,
  EntityStackContainer,
  EntityStackWrapper,
  MainStackWrapper,
} from './EntityStackWithBadge.styles';

interface EntityStackWithBadgeSkeletonProps {
  size?: AvatarSize;
  badgeSize?: AvatarSize;
  gap?: number;
  isContentVisible?: boolean;
  animation?: 'pulse' | 'wave' | false;
  avatarSx?: Parameters<typeof AvatarSkeleton>[0]['sx'];
}

export const EntityStackWithBadgeSkeleton: FC<
  EntityStackWithBadgeSkeletonProps
> = ({
  size = AvatarSize.XL,
  badgeSize = AvatarSize.XS,
  gap,
  isContentVisible = true,
  animation = 'wave',
  avatarSx,
}) => {
  return (
    <EntityStackContainer sx={{ gap }} isContentVisible={isContentVisible}>
      <EntityStackWrapper>
        <MainStackWrapper hasOverlayMask badgeSize={badgeSize}>
          <AvatarSkeleton
            size={size}
            variant="circular"
            animation={animation}
            sx={avatarSx}
          />
        </MainStackWrapper>
        <BadgeStackWrapper badgeSize={badgeSize}>
          <AvatarSkeleton
            size={badgeSize}
            variant="circular"
            animation={animation}
            sx={avatarSx}
          />
        </BadgeStackWrapper>
      </EntityStackWrapper>
      {isContentVisible && <TitleWithHintSkeleton />}
    </EntityStackContainer>
  );
};
