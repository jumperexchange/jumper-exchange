import { Avatar, Badge, Avatar as MuiAvatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getAvatarMask } from './getAvatarMask';

// Styled component for Badge Content (badge image)

// Styled component for AvatarBadge

// Styled avatar
export const StyledBadgeAvatar = styled(MuiAvatar, {
  shouldForwardProp: (prop) => prop !== 'badgeSize',
})<{
  badgeSize: number;
}>(({ badgeSize }) => ({
  width: badgeSize,
  height: badgeSize,
  position: 'absolute',
  bottom: 0,
  right: 0,
  top: 'unset',
  left: 'unset',
  // display: 'block',
}));

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
export const StyledAvatar = styled(Avatar, {
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
export const StyledBadge = styled(Badge, {
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
  },
}));
