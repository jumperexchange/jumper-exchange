import { Skeleton } from '@mui/material';
import React from 'react';
import {
  StyledAvatar,
  StyledBadge,
  StyledBadgeAvatar,
} from './AvatarBadge.style';

export interface BadgeOffsetProps {
  x?: number;
  y?: number;
}

type AvatarBadgeProps = {
  avatarSrc?: string;
  badgeSrc?: string;
  badgeOffset?: BadgeOffsetProps;
  avatarSize: number;
  badgeGap?: number;
  badgeSize: number;
  alt: string;
  badgeAlt: string;
};

const AvatarBadge: React.FC<AvatarBadgeProps> = ({
  avatarSrc,
  badgeSrc,
  badgeOffset,
  badgeGap,
  avatarSize,
  badgeSize,
  alt,
  badgeAlt,
}) => {
  return (
    <StyledBadge
      overlap="circular"
      badgeOffset={badgeOffset}
      avatarSize={avatarSize}
      // anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <StyledBadgeAvatar src={badgeSrc} alt={badgeAlt} badgeSize={badgeSize}>
          <Skeleton variant="circular" width={badgeSize} height={badgeSize} />
        </StyledBadgeAvatar>
      }
    >
      <StyledAvatar
        src={avatarSrc}
        alt={alt}
        avatarSize={avatarSize}
        badgeSize={badgeSize}
        badgeOffset={{ x: badgeOffset?.x, y: badgeOffset?.y }}
        badgeGap={badgeGap}
      >
        <Skeleton variant="circular" width={avatarSize} height={avatarSize} />
      </StyledAvatar>
    </StyledBadge>
  );
};

export default AvatarBadge;
