import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

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
export const EntityStackWrapper = styled(Box)({
  position: 'relative',
  width: 'fit-content',
});

/**
 * Wrapper for badge stack - positioned absolutely bottom-right
 */
export const BadgeStackWrapper = styled(Box)({
  position: 'absolute',
  bottom: -2,
  right: -7,
});
