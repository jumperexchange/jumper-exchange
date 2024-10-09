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
  avatarAlt: string;
  avatarSize: number;
  avatarSrc?: string;
  badgeAlt: string;
  badgeSize: number;
  badgeSrc?: string;
  badgeOffset?: BadgeOffsetProps;
  badgeGap?: number;
};

const AvatarBadge: React.FC<AvatarBadgeProps> = ({
  avatarAlt,
  avatarSize,
  avatarSrc,
  badgeAlt,
  badgeSize,
  badgeSrc,
  badgeOffset,
  badgeGap,
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
        alt={avatarAlt}
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
