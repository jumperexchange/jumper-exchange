import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { getCustomOverlayMask } from '@/components/core/AvatarStack/AvatarStack.styles';

interface EntityStackContainerProps {
  isContentVisible?: boolean;
}

/**
 * Main container - holds avatar stack and content side by side
 */
export const EntityStackContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isContentVisible',
})<EntityStackContainerProps>(({ theme, isContentVisible }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(2),
  ...(isContentVisible && {
    minWidth: 0,
  }),
}));

/**
 * Wrapper for main avatar stack - positions badge overlay relative to this
 */
export const EntityStackWrapper = styled(Box)(() => ({
  position: 'relative',
  width: 'fit-content',
}));

interface MainStackWrapperProps {
  hasOverlayMask?: boolean;
  badgeSize?: AvatarSize;
}

export const MainStackWrapper = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== 'hasOverlayMask' && prop !== 'badgeSize',
})<MainStackWrapperProps>(({ hasOverlayMask, badgeSize }) => {
  if (!hasOverlayMask || !badgeSize) {
    return {};
  }
  return {
    mask: getCustomOverlayMask(badgeSize),
  };
});

interface BadgeStackWrapperProps {
  badgeSize: AvatarSize;
}

/**
 * Wrapper for badge stack - positioned absolutely bottom-right
 */
export const BadgeStackWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'badgeSize',
})<BadgeStackWrapperProps>(() => ({
  position: 'absolute',
  bottom: -2,
  variants: [
    {
      props: ({ badgeSize }) => badgeSize === AvatarSize['3XS'],
      style: {
        right: -2,
      },
    },
    {
      props: ({ badgeSize }) => badgeSize === AvatarSize.XXS,
      style: {
        right: -4,
      },
    },
    {
      props: ({ badgeSize }) => badgeSize === AvatarSize.XS,
      style: {
        right: -6,
      },
    },
    {
      props: ({ badgeSize }) => badgeSize === AvatarSize.SM,
      style: {
        right: -7,
      },
    },
    {
      props: ({ badgeSize }) => badgeSize === AvatarSize.MD,
      style: {
        right: -10,
      },
    },
    {
      props: ({ badgeSize }) => badgeSize === AvatarSize.LG,
      style: {
        right: -14,
      },
    },
    {
      props: ({ badgeSize }) => badgeSize === AvatarSize.XL,
      style: {
        right: -18,
      },
    },
    {
      props: ({ badgeSize }) => badgeSize === AvatarSize.XXL,
      style: {
        right: -22,
      },
    },
  ],
}));
