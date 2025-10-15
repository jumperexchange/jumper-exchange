import MuiAvatar, { AvatarProps as MuiAvatarProps } from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { AvatarSize } from './AvatarStack.types';
import Skeleton, { SkeletonProps } from '@mui/material/Skeleton';

const getAvatarSize = (size: AvatarSize) => {
  switch (size) {
    case AvatarSize['3XS']:
      return {
        width: 9,
        height: 9,
      };
    case AvatarSize.XXS:
      return {
        width: 12,
        height: 12,
      };
    case AvatarSize.XS:
      return {
        width: 16,
        height: 16,
      };
    case AvatarSize.SM:
      return {
        width: 18,
        height: 18,
      };
    case AvatarSize.MD:
      return {
        width: 24,
        height: 24,
      };
    case AvatarSize.LG:
      return {
        width: 32,
        height: 32,
      };
    case AvatarSize.XL:
      return {
        width: 40,
        height: 40,
      };
    case AvatarSize.XXL:
      return {
        width: 48,
        height: 48,
      };
    default:
      return {
        width: 24,
        height: 24,
      };
  }
};

export const AvatarStackWrapper = styled(Stack)(({ theme }) => ({
  width: 'fit-content',
}));

// @Note extract this in a separate component
const BaseAvatar = styled(MuiAvatar)(({ theme }) => ({
  boxSizing: 'content-box',
  border: 2,
  borderStyle: 'solid',
  borderColor: (theme.vars || theme).palette.background.default,
  backgroundColor: (theme.vars || theme).palette.background.default,
  ...theme.applyStyles('light', {
    borderColor: (theme.vars || theme).palette.white.main,
    backgroundColor: (theme.vars || theme).palette.white.main,
  }),
}));

interface AvatarProps extends MuiAvatarProps {
  size?: AvatarSize;
  disableBorder?: boolean;
}

export const Avatar = styled(BaseAvatar, {
  shouldForwardProp: (prop) => prop !== 'size' && prop !== 'disableBorder',
})<AvatarProps>(({ size = AvatarSize.MD, disableBorder = false }) => ({
  ...(disableBorder && {
    border: 'none',
  }),
  ...getAvatarSize(size),
}));

interface AvatarSkeletonProps extends SkeletonProps {
  size?: AvatarSize;
}

export const AvatarSkeleton = styled(Skeleton, {
  shouldForwardProp: (prop) => prop !== 'size',
})<AvatarSkeletonProps>(({ theme, size = AvatarSize.MD }) => ({
  backgroundColor: (theme.vars || theme).palette.surface2.main,
  ...getAvatarSize(size),
}));
