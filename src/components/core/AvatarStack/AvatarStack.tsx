import { FC } from 'react';
import {
  AvatarStackWrapper,
  Avatar,
  AvatarSkeleton,
  AvatarStackContainer,
} from './AvatarStack.styles';
import { AvatarSize, AvatarStackDirection } from './AvatarStack.types';
import Typography from '@mui/material/Typography';

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
  const displayAvatars = limit ? avatars.slice(0, limit) : avatars;
  const remainingCount =
    limit && avatars.length > limit ? avatars.length - limit : 0;

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
            <AvatarSkeleton size={size} key={avatar.id} variant="circular" />
          </Avatar>
        ))}
      </AvatarStackWrapper>
      {remainingCount > 0 && (
        <Typography variant="bodySmallStrong" color="textSecondary">
          +{remainingCount}
        </Typography>
      )}
    </AvatarStackContainer>
  );
};
