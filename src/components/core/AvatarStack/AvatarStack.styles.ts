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

export const SPACING_SIZE = 8;
export const AVATAR_STACK_BORDER_WIDTH = 2;

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
      return { width: 9, height: 9 };
    case AvatarSize.XXS:
      return { width: 12, height: 12 };
    case AvatarSize.XS:
      return { width: 16, height: 16 };
    case AvatarSize.SM:
      return { width: 18, height: 18 };
    case AvatarSize.MD:
      return { width: 24, height: 24 };
    case AvatarSize.LG:
      return { width: 32, height: 32 };
    case AvatarSize.XL:
      return { width: 40, height: 40 };
    case AvatarSize.XXL:
      return { width: 48, height: 48 };
    default:
      return { width: 24, height: 24 };
  }
};

export const getMaskRadius = (
  size: AvatarSize,
  borderWidth: number = AVATAR_STACK_BORDER_WIDTH,
) => {
  const { width } = getAvatarSize(size);
  return width / 2 + borderWidth;
};

const getRadialMask = (circlePosition: string, maskRadius: number): string =>
  `radial-gradient(circle at ${circlePosition}, transparent ${maskRadius}px, black ${maskRadius}px)`;

export const getEdgeOffset = (
  spacingUnits: number,
  avatarSize: number,
  borderWidth: number,
): string => {
  const spacingPx = spacingUnits * SPACING_SIZE;
  const avatarRadius = avatarSize / 2;
  const offset = spacingPx + avatarRadius;

  return `${offset}px`;
};

export const getOverlapMaskPosition = (
  overlap: AvatarOverlap,
  spacingUnits: number,
  avatarSize: number,
  borderWidth: number,
): string => {
  const offset = getEdgeOffset(spacingUnits, avatarSize, borderWidth);
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
  spacingUnits: number = 1,
  borderWidth: number = AVATAR_STACK_BORDER_WIDTH,
): string => {
  const maskRadius = getMaskRadius(size, borderWidth);
  const avatarSizePx = getAvatarSize(size).width;
  const position = getOverlapMaskPosition(
    overlap,
    spacingUnits,
    avatarSizePx,
    borderWidth,
  );
  return getRadialMask(position, maskRadius);
};

export const getCustomOverlayMask = (
  avatarSize: AvatarSize,
  borderWidth: number = AVATAR_STACK_BORDER_WIDTH,
): string => {
  const { width } = getAvatarSize(avatarSize);
  const maskRadius = getMaskRadius(avatarSize, borderWidth);
  const circlePosition = `calc(100% - ${borderWidth}px) calc(100% - ${width / 2}px + ${borderWidth}px)`;
  return getRadialMask(circlePosition, maskRadius);
};

export const AvatarStackContainer = styled(Stack)(() => ({
  width: 'fit-content',
  alignItems: 'center',
  gap: SPACING_SIZE,
  variants: [
    {
      props: ({ direction }) =>
        direction === 'column' || direction === 'column-reverse',
      style: { flexDirection: 'column' },
    },
    {
      props: ({ direction }) =>
        direction === 'row' || direction === 'row-reverse',
      style: { flexDirection: 'row' },
    },
  ],
}));

export const AvatarStackWrapper = styled(Stack)(() => ({
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
})<AvatarProps>(({ size = AvatarSize.MD, spacing = 1 }) => {
  const avatarSizePx = getAvatarSize(size).width;
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
              spacing,
              AVATAR_STACK_BORDER_WIDTH,
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
              spacing,
              AVATAR_STACK_BORDER_WIDTH,
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
              spacing,
              AVATAR_STACK_BORDER_WIDTH,
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
              spacing,
              AVATAR_STACK_BORDER_WIDTH,
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
})<AvatarSkeletonProps>(({ size = AvatarSize.MD }) => ({
  ...getAvatarSize(size),
  flexShrink: 0,
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
