import MuiAvatar, { AvatarProps as MuiAvatarProps } from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { styled, Theme } from '@mui/material/styles';
import { AvatarSize } from './AvatarStack.types';
import Skeleton, { SkeletonProps } from '@mui/material/Skeleton';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { BaseSurfaceSkeleton } from '../skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';

export const getFontVariant = (size: AvatarSize, theme: Theme) => {
  switch (size) {
    case AvatarSize['3XS']:
    case AvatarSize.XXS:
    case AvatarSize.XS:
      return theme.typography.bodyXSmallStrong;
    case AvatarSize.MD:
      return theme.typography.bodyMediumStrong;
    case AvatarSize.LG:
      return theme.typography.bodyLargeStrong;
    case AvatarSize.XL:
    case AvatarSize.XXL:
      return theme.typography.bodyXLargeStrong;
    default:
      return theme.typography.bodySmallStrong;
  }
};

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

export const AvatarStackContainer = styled(Stack)(({ theme }) => ({
  width: 'fit-content',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  variants: [
    {
      props: ({ direction }) =>
        direction === 'column' || direction === 'column-reverse',
      style: {
        flexDirection: 'column',
      },
    },
    {
      props: ({ direction }) =>
        direction === 'row' || direction === 'row-reverse',
      style: {
        flexDirection: 'row',
      },
    },
  ],
}));

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

export const AvatarSkeleton = styled(BaseSurfaceSkeleton, {
  shouldForwardProp: (prop) => prop !== 'size',
})<AvatarSkeletonProps>(({ theme, size = AvatarSize.MD }) => ({
  ...getAvatarSize(size),
}));

interface BaseTypographyProps extends TypographyProps {
  size?: AvatarSize;
}

export const BaseTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'size',
})<BaseTypographyProps>(({ theme, size = AvatarSize.MD }) => ({
  ...getFontVariant(size, theme),
}));

export const OverflowCount = styled(BaseTypography)(({}) => ({}));

export const AvatarPlaceholder = styled(BaseTypography)(({}) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1,
  width: 'fit-content',
  fontWeight: 500,
}));
