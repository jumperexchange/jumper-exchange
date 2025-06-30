import { Skeleton, SxProps, Theme } from '@mui/material';
import React from 'react';
import {
  BadgeOffsetProps,
  StyledAvatar,
  StyledBadge,
  StyledBadgeAvatar,
} from './AvatarBadge.style';

type AvatarBadgeProps = {
  avatarSrc?: string;
  badgeSrc?: string;
  badgeOffset?: BadgeOffsetProps;
  avatarSize: number;
  badgeGap?: number;
  badgeSize?: number;
  alt: string;
  badgeAlt?: string;
  maskEnabled?: boolean;
  sx?: SxProps<Theme>;
  sxAvatar?: SxProps<Theme>;
  sxBadge?: SxProps<Theme>;
};

const AvatarBadge: React.FC<AvatarBadgeProps> = ({
  avatarSrc,
  badgeSrc,
  badgeOffset,
  badgeGap,
  avatarSize,
  badgeSize = 12,
  alt,
  badgeAlt = 'Badge alt',
  maskEnabled = true,
  sx,
  sxAvatar,
  sxBadge,
}) => {
  return (
    <StyledBadge
      overlap="circular"
      badgeOffset={badgeOffset}
      // anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        badgeSrc && (
          <StyledBadgeAvatar
            src={badgeSrc}
            alt={badgeAlt}
            badgeSize={badgeSize}
            sx={sxBadge}
          >
            <Skeleton variant="circular" width={badgeSize} height={badgeSize} />
          </StyledBadgeAvatar>
        )
      }
      sx={sx}
    >
      <StyledAvatar
        src={avatarSrc}
        alt={alt}
        avatarSize={avatarSize}
        badgeSize={badgeSize}
        badgeOffset={{ x: badgeOffset?.x, y: badgeOffset?.y }}
        badgeGap={badgeGap}
        maskEnabled={maskEnabled}
        sx={sxAvatar}
      >
        <Skeleton variant="circular" width={avatarSize} height={avatarSize} />
      </StyledAvatar>
    </StyledBadge>
  );
};

export default AvatarBadge;
