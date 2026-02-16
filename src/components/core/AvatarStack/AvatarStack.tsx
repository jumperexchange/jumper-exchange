import { type FC } from 'react';
import {
  AvatarStackWrapper,
  AvatarStackContainer,
  OverflowCount,
} from './AvatarStack.styles';
import type {
  AvatarSize,
  AvatarStackDirection,
  AvatarData,
  AvatarOverlap,
} from './AvatarStack.types';
import { AvatarItem } from './AvatarItem';
import { getOverlapFromDirection } from './utils';

interface AvatarStackProps {
  avatars: AvatarData[];
  size?: AvatarSize;
  spacing?: number;
  direction?: AvatarStackDirection;
  disableBorder?: boolean;
  limit?: number;
}

export const AvatarStack: FC<AvatarStackProps> = ({
  avatars,
  size,
  spacing = -1.5,
  direction = 'row',
  disableBorder = false,
  limit,
}) => {
  const hasOverflow = limit && avatars.length > limit;
  const overflowCount = hasOverflow ? avatars.length - limit : 0;
  const displayAvatars = hasOverflow ? avatars.slice(0, limit) : avatars;
  const orderedAvatars = direction.includes('reverse')
    ? displayAvatars.reverse()
    : displayAvatars;

  return (
    <AvatarStackContainer direction={direction} useFlexGap>
      <AvatarStackWrapper direction={direction} spacing={spacing}>
        {orderedAvatars.map((avatar) => (
          <AvatarItem
            key={avatar.id}
            avatar={avatar}
            size={size}
            spacing={spacing}
            overlap={getOverlapFromDirection(direction, disableBorder)}
          />
        ))}
      </AvatarStackWrapper>
      {overflowCount > 0 && (
        <OverflowCount size={size} color="textSecondary">
          +{overflowCount}
        </OverflowCount>
      )}
    </AvatarStackContainer>
  );
};
