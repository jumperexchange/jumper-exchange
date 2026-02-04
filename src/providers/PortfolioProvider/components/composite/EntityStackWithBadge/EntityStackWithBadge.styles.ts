import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import type { AvatarSize } from '../../core/AvatarStack/AvatarStack.types';
import { getCustomOverlayMask } from '../../core/AvatarStack/AvatarStack.styles';

interface EntityStackContainerProps {
  isContentVisible?: boolean;
}

/**
 * Main container - holds avatar stack and content side by side
 */
export const EntityStackContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isContentVisible',
})<EntityStackContainerProps>(({ isContentVisible }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 16,
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

/**
 * Wrapper for badge stack - positioned absolutely bottom-right
 */
export const BadgeStackWrapper = styled(Box)({
  position: 'absolute',
  bottom: -2,
  right: -7,
});
