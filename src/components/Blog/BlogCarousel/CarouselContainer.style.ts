import { IconButtonSecondary } from '@/components/IconButton.style';
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
  paddingBottom: theme.spacing(0.75),
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
  color: theme.palette.text.primary,
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
})<CarouselNavigationContainerProps>(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.up('md' as Breakpoint)]: {
    marginLeft: 3,
  },
  variants: [
    {
      props: ({ hide }) => hide,
      style: {
        [theme.breakpoints.up('md' as Breakpoint)]: { display: 'none' },
      },
    },
  ],
}));

export const CarouselNavigationButton = styled(IconButtonSecondary, {
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
