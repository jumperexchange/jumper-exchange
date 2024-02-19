import type { BoxProps, SkeletonProps } from '@mui/material';
import { Box, Skeleton, styled } from '@mui/material';

export const ShareIconsContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<BoxProps>(() => ({
  display: 'flex',
  alignItems: 'center',

  'button:first-of-type': {
    margin: 0,
  },
}));

export const ShareIconsSkeletons = styled(Skeleton, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<SkeletonProps>(() => ({
  width: 176,
  height: 40,
  borderRadius: '20px',
}));
