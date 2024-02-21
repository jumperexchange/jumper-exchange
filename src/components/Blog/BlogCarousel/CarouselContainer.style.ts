import type {
  BoxProps,
  Breakpoint,
  CSSObject,
  IconButtonProps,
} from '@mui/material';
import { Box, Typography, styled } from '@mui/material';
import { IconButtonTransparent } from 'src/components/IconButton.style';

export interface CarouselContainerBoxProps extends Omit<BoxProps, 'variant'> {
  styles?: CSSObject;
}

export const CarouselContainerBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<CarouselContainerBoxProps>(({ theme, styles }) => ({
  display: 'flex',
  gap: theme.spacing(4),
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
    height: 435,
  },
  ...styles,
}));

export const CarouselHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<BoxProps>(({ theme }) => ({
  display: 'flex',
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.white.main,
  }),
  justifyContent: 'space-between',
}));

export const CarouselTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'styles' && prop !== 'show',
})<CarouselNavigationContainerProps>(({ theme, show }) => ({
  fontFamily: 'Urbanist, Inter',
  fontWeight: 700,
  fontSize: '24px',
  lineHeight: '32px',
  color: 'inherit',
  margin: theme.spacing(3, 1.5, 0),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(0, 1.5, 0),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    justifyContent: 'flex-start',
    margin: 0,
  },
}));

export interface CarouselNavigationContainerProps
  extends Omit<BoxProps, 'variant'> {
  show?: boolean;
}

export const CarouselNavigationContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'styles' && prop !== 'show',
})<CarouselNavigationContainerProps>(({ theme, show }) => ({
  display: 'none',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    display: 'flex',
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    ...(show && { display: 'none' }),
    marginLeft: 3,
  },
}));

export const CarouselNavigationButton = styled(IconButtonTransparent, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<IconButtonProps>(({ theme }) => ({
  width: 40,
  height: 40,
  fontSize: 22,
}));
