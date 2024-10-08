import { Avatar as MuiAvatar, Badge as MuiBadge } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getAvatarMask } from '../Mask.style';

// Styled component for Avatar with dynamic mask
export const StyledAvatar = styled(MuiAvatar)<{
  avatarSize: number;
  badgeSize: number;
}>(({ avatarSize, badgeSize }) => ({
  margin: 'auto',
  height: avatarSize,
  width: avatarSize,
  '> img': {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
  },
  mask: getAvatarMask({ avatarSize, badgeSize }), // Applying the dynamic mask
}));

// Styled component for Badge Content (badge image)
export const StyledBadgeContent = styled(MuiAvatar)<{ size: number }>(
  ({ size }) => ({
    width: size,
    height: size,
    backgroundColor: '#fff',
    '& img': {
      objectFit: 'contain',
    },
  }),
);

// Styled component for AvatarBadge
export const StyledAvatarBadge = styled(MuiBadge)<{
  avatarSize: number;
  badgeSize: number;
}>(({ avatarSize, badgeSize }) => ({
  borderRadius: '50%',
  '> .MuiAvatar-root': {
    mask: getAvatarMask({ avatarSize, badgeSize }), // Applying the same dynamic mask to the badge
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
  // display: 'block',
}));
