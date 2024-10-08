import { Avatar, Badge, Skeleton, styled } from '@mui/material';
import React from 'react';
import { getAvatarMask } from '../Mask.style'; // Ensure the correct import path
import { StyledBadgeAvatar } from './AvatarBadge.style';

export interface BadgeOffsetProps {
  x?: number;
  y?: number;
}

interface StyledAvatarProps {
  avatarSize: number;
  badgeSize: number;
  badgeOffset?: BadgeOffsetProps;
  badgeGap?: number;
}

// Styled Avatar component for the badge
const StyledAvatar = styled(Avatar, {
  shouldForwardProp: (prop) =>
    prop !== 'avatarSize' &&
    prop !== 'badgeSize' &&
    prop !== 'badgeOffset' &&
    prop !== 'badgeGap',
})<StyledAvatarProps>(({ avatarSize, badgeSize, badgeOffset, badgeGap }) => ({
  height: avatarSize,
  width: avatarSize,
  mask: getAvatarMask({ avatarSize, badgeSize, badgeOffset, badgeGap }), // Apply dynamic mask based on avatar and badge size
  '> img': {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
  },
}));

interface StyledBadgeProps {
  badgeOffset?: BadgeOffsetProps;
}

// Styled Badge component for the badge
const StyledBadge = styled(Badge, {
  shouldForwardProp: (prop) => prop !== 'badgeOffset',
})<StyledBadgeProps>(({ badgeOffset }) => ({
  borderRadius: '50%',
  display: 'block',

  '.MuiBadge-badge': {
    position: 'static', // Remove absolute positioning
    transform: 'none', // Remove unwanted transformations
    top: 'unset', // Remove positioning
    right: 'unset', // Remove positioning
    zIndex: 'unset', // Remove z-index if not needed
    minWidth: 'unset', // Remove minimum width
    padding: 'unset', // Remove padding if not needed
    height: 'unset', // Remove height
    lineHeight: 'unset', // Remove line height
    ...((badgeOffset?.x || badgeOffset?.y) && {
      transform: `translate(${badgeOffset?.x ? badgeOffset.x : 0}px, ${badgeOffset?.y ? badgeOffset.y : 0}px)`,
    }),
    // Add any additional custom styles here
  },
}));

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
