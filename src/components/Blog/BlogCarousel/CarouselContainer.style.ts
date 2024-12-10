import { IconButtonTertiary } from '@/components/IconButton.style';
import type {
  BoxProps,
  Breakpoint,
  CSSObject,
  IconButtonProps,
} from '@mui/material';
import { Box, styled } from '@mui/material';

export interface CarouselContainerBoxProps extends Omit<BoxProps, 'variant'> {
  styles?: CSSObject;
}

export const CarouselContainerBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<CarouselContainerBoxProps>(({ theme, styles }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  marginTop: theme.spacing(3),
  overflow: 'auto',
  width: '100%',
  overflowY: 'hidden',
  scrollSnapType: 'x mandatory',
  '& > *': {
    flexShrink: 0,
    scrollSnapAlign: 'center',
  },
  '::-webkit-scrollbar': { display: 'none' },
  ...styles,
}));

export const CarouselHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(1.5),
  justifyContent: 'space-between',
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.white.main,
  }),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginTop: 0,
  },
}));

export interface CarouselNavigationContainerProps
  extends Omit<BoxProps, 'variant'> {
  hide?: boolean;
}

export const CarouselNavigationContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hide',
})<CarouselNavigationContainerProps>(({ theme, hide }) => ({
  display: 'flex',
  [theme.breakpoints.up('md' as Breakpoint)]: {
    ...(hide && { display: 'none' }),
    marginLeft: 3,
  },
}));

export const CarouselNavigationButton = styled(IconButtonTertiary, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<IconButtonProps>(({ theme }) => ({
  width: 40,
  height: 40,
  fontSize: 22,
}));

export const CarouselCenteredBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
