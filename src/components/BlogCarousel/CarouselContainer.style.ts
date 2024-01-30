import type { BoxProps, Breakpoint, CSSObject } from '@mui/material';
import { Box, styled } from '@mui/material';

export interface CarouselContainerBoxProps extends Omit<BoxProps, 'variant'> {
  styles?: CSSObject;
}

export const CarouselContainerBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<CarouselContainerBoxProps>(({ theme, styles }) => ({
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
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    height: 308,
  },
  ...styles,
}));
