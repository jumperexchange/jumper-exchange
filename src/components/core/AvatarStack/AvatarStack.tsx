import { FC } from 'react';
import {
  AvatarStackWrapper,
  Avatar,
  AvatarSkeleton,
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
}

export const AvatarStack: FC<AvatarStackProps> = ({
  avatars,
  size,
  spacing = -1.5,
  direction = 'row',
  disableBorder = false,
}) => {
  return (
    <AvatarStackWrapper direction={direction} spacing={spacing}>
      {avatars.map((avatar) => (
        <Avatar
          size={size}
          key={avatar.id}
          src={avatar.src}
          alt={avatar.alt}
          disableBorder={disableBorder}
          variant="circular"
        >
          <AvatarSkeleton size={size} key={avatar.id} variant="circular" />
        </Avatar>
      ))}
    </AvatarStackWrapper>
  );
};
