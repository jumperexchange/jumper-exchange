import { useMemo, type FC } from 'react';
import {
  AvatarStackWrapper,
  AvatarStackContainer,
  OverflowCount,
} from './AvatarStack.styles';
import type {
  AvatarSize,
  AvatarStackDirection,
  AvatarData,
} from './AvatarStack.types';
import { AvatarItem } from './AvatarItem';
import { getOverlapFromDirection } from './utils';
import type { SxProps, Theme } from '@mui/material/styles';

export interface AvatarStackProps {
  avatars: AvatarData[];
  size?: AvatarSize;
  spacing?: number;
  direction?: AvatarStackDirection;
  disableBorder?: boolean;
  limit?: number;
  avatarSx?: SxProps<Theme>;
  useAvatarOverflow?: boolean;
}

export const AvatarStack: FC<AvatarStackProps> = ({
  avatars,
  size,
  spacing = -1.5,
  direction = 'row',
  disableBorder = false,
  limit,
  avatarSx,
  useAvatarOverflow = false,
}) => {
  const { orderedAvatars, overflowCount } = useMemo(() => {
    const hasOverflow = limit && avatars.length > limit;
    const overflowCount = hasOverflow ? avatars.length - limit : 0;

    const baseAvatars = hasOverflow ? avatars.slice(0, limit) : avatars;

    const avatarsWithOverflow =
      overflowCount > 0 && useAvatarOverflow
        ? [
            ...baseAvatars,
            {
              count: overflowCount,
              variant: 'bodyXXSmallStrong' as const,
              startAdornment: '+',
            },
          ]
        : baseAvatars;

    const orderedAvatars = direction.includes('reverse')
      ? [...avatarsWithOverflow].reverse()
      : avatarsWithOverflow;

    return { orderedAvatars, overflowCount };
  }, [avatars, limit, useAvatarOverflow, direction]);

  return (
    <AvatarStackContainer direction={direction} useFlexGap>
      <AvatarStackWrapper direction={direction} spacing={spacing}>
        {orderedAvatars.map((avatar, index) => (
          <AvatarItem
            key={'id' in avatar ? avatar.id : `AvatarItem-${index}`}
            avatar={avatar}
            size={size}
            spacing={spacing}
            overlap={getOverlapFromDirection(direction, disableBorder)}
            sx={avatarSx}
          />
        ))}
      </AvatarStackWrapper>
      {overflowCount > 0 && !useAvatarOverflow && (
        <OverflowCount size={size} color="textSecondary">
          +{overflowCount}
        </OverflowCount>
      )}
    </AvatarStackContainer>
  );
};
