import { FC } from 'react';
import {
  AvatarStackWrapper,
  Avatar,
  AvatarSkeleton,
  AvatarStackContainer,
  AvatarPlaceholder,
  OverflowCount,
} from './AvatarStack.styles';
import { AvatarSize, AvatarStackDirection } from './AvatarStack.types';

interface AvatarStackProps {
  avatars: {
    id: string;
    src: string;
    alt: string;
  }[];
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

  return (
    <AvatarStackContainer direction={direction} useFlexGap>
      <AvatarStackWrapper direction={direction} spacing={spacing}>
        {displayAvatars.map((avatar) => (
          <Avatar
            size={size}
            key={avatar.id}
            src={avatar.src}
            alt={avatar.alt}
            disableBorder={disableBorder}
            variant="circular"
          >
            {avatar.alt ? (
              <AvatarPlaceholder size={size} color="textSecondary">
                {avatar.alt[0].toUpperCase()}
              </AvatarPlaceholder>
            ) : null}
            <AvatarSkeleton size={size} key={avatar.id} variant="circular" />
          </Avatar>
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
