import { Avatar, Badge, Avatar as MuiAvatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { BadgeOffsetProps } from './AvatarBadge';
import { getAvatarMask } from './getAvatarMask';

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
  avatarSize: number;
}

// Styled Badge component for the badge
export const StyledBadge = styled(Badge, {
  shouldForwardProp: (prop) => prop !== 'badgeOffset' && prop !== 'avatarSize',
})<StyledBadgeProps>(({ badgeOffset, avatarSize }) => ({
  borderRadius: '50%',
  display: 'block',
  height: avatarSize,
  width: avatarSize,

  '.MuiBadge-badge': {
    position: 'static',
    transform: 'none',
    top: 'unset',
    right: 'unset',
    zIndex: 'unset',
    minWidth: 'unset',
    padding: 'unset',
    height: 'unset',
    lineHeight: 'unset',
    ...((badgeOffset?.x || badgeOffset?.y) && {
      transform: `translate(${badgeOffset?.x ? badgeOffset.x : 0}px, ${badgeOffset?.y ? badgeOffset.y : 0}px)`,
    }),
  },
}));

// Styled avatar
export const StyledBadgeAvatar = styled(MuiAvatar)<{
  badgeSize: number;
}>(({ badgeSize }) => ({
  width: badgeSize,
  height: badgeSize,
  position: 'absolute',
  bottom: 0,
  right: 0,
  top: 'unset',
  left: 'unset',
}));
