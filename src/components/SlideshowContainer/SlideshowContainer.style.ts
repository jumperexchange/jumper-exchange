import type { BoxProps, CSSObject } from '@mui/material';
import { Box, styled } from '@mui/material';

export interface SlideshowContainerBoxProps extends Omit<BoxProps, 'variant'> {
  styles?: CSSObject;
}

export const SlideshowContainerBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<SlideshowContainerBoxProps>(({ theme, styles }) => ({
  display: 'flex',
  gap: 12,
  marginTop: theme.spacing(4),
  p: theme.spacing(4, 0),
  overflow: 'auto',
  width: '100%',
  scrollSnapType: 'x mandatory',
  '& > *': {
    scrollSnapAlign: 'center',
  },
  '::-webkit-scrollbar': { display: 'none' },
  ...styles,
}));
