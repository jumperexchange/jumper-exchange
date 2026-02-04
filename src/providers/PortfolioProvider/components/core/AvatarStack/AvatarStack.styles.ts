import type { AvatarProps as MuiAvatarProps } from '@mui/material/Avatar';
import MuiAvatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import type { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import type { AvatarOverlap } from './AvatarStack.types';
import { AvatarSize } from './AvatarStack.types';
import type { SkeletonProps } from '@mui/material/Skeleton';
import type { TypographyProps } from '@mui/material/Typography';
import Typography from '@mui/material/Typography';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';

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

export const getAvatarSize = (size: AvatarSize) => {
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

export const AVATAR_STACK_BORDER_WIDTH = 2;

export const getMaskRadius = (
  size: AvatarSize,
  borderWidth: number = AVATAR_STACK_BORDER_WIDTH,
) => {
  const dimensions = getAvatarSize(size);
  const radius = dimensions.width / 2;
  return radius + borderWidth;
};

const getRadialMask = (circlePosition: string, maskRadius: number): string =>
  `radial-gradient(circle at ${circlePosition}, transparent ${maskRadius}px, black ${maskRadius}px)`;

// @TODO: this needs a bit more work
const getEdgeOffset = (borderWidth: number, spacingCss: string) =>
  `calc(${borderWidth}px + abs(calc(${spacingCss || '0px'} / 2)))`;

export const getOverlapMaskPosition = (
  overlap: AvatarOverlap,
  borderWidth: number,
  spacingCss: string = '0px',
): string => {
  const offset = getEdgeOffset(borderWidth, spacingCss);

  switch (overlap) {
    case 'right':
      return `calc(100% + ${offset}) 50%`;
    case 'left':
      return `calc(0% - ${offset}) 50%`;
    case 'bottom':
      return `50% calc(100% + ${offset})`;
    case 'top':
      return `50% calc(0% - ${offset})`;
    default:
      return '50% 50%';
  }
};

export const getOverlapMask = (
  overlap: AvatarOverlap,
  size: AvatarSize,
  borderWidth: number = AVATAR_STACK_BORDER_WIDTH,
  spacingCss?: string,
): string => {
  const maskRadius = getMaskRadius(size, borderWidth);
  return getRadialMask(
    getOverlapMaskPosition(overlap, borderWidth, spacingCss),
    maskRadius,
  );
};

export const getCustomOverlayMask = (
  avatarSize: AvatarSize,
  borderWidth: number = AVATAR_STACK_BORDER_WIDTH,
): string => {
  const avatarWidth = getAvatarSize(avatarSize).width;
  const maskRadius = getMaskRadius(avatarSize, borderWidth);
  const circlePosition = `calc(100% - ${borderWidth}px) calc(100% - ${avatarWidth / 2}px + ${borderWidth}px)`;
  return getRadialMask(circlePosition, maskRadius);
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

const BaseAvatar = styled(MuiAvatar)(({ theme }) => ({
  boxSizing: 'content-box',
  backgroundColor: (theme.vars || theme).palette.background.default,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.white.main,
  }),
}));

interface AvatarProps extends MuiAvatarProps {
  size?: AvatarSize;
  overlap?: AvatarOverlap;
  spacing?: number;
}

export const Avatar = styled(BaseAvatar, {
  shouldForwardProp: (prop) =>
    prop !== 'size' && prop !== 'overlap' && prop !== 'spacing',
})<AvatarProps>(({ theme, size = AvatarSize.MD, spacing }) => {
  const spacingCss = spacing !== undefined ? theme.spacing(spacing) : '0px';

  return {
    ...getAvatarSize(size),
    variants: [
      {
        props: ({ overlap }) => overlap === 'right',
        style: {
          ':not(:last-child)': {
            mask: getOverlapMask(
              'right',
              size,
              AVATAR_STACK_BORDER_WIDTH,
              spacingCss,
            ),
          },
        },
      },
      {
        props: ({ overlap }) => overlap === 'bottom',
        style: {
          ':not(:last-child)': {
            mask: getOverlapMask(
              'bottom',
              size,
              AVATAR_STACK_BORDER_WIDTH,
              spacingCss,
            ),
          },
        },
      },
      {
        props: ({ overlap }) => overlap === 'left',
        style: {
          ':not(:last-child)': {
            mask: getOverlapMask(
              'left',
              size,
              AVATAR_STACK_BORDER_WIDTH,
              spacingCss,
            ),
          },
        },
      },
      {
        props: ({ overlap }) => overlap === 'top',
        style: {
          ':not(:last-child)': {
            mask: getOverlapMask(
              'top',
              size,
              AVATAR_STACK_BORDER_WIDTH,
              spacingCss,
            ),
          },
        },
      },
    ],
  };
});

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
