import { IconButtonSecondary } from '@/components/IconButton.style';
import type { BoxProps, Breakpoint } from '@mui/material';
import { Box, styled } from '@mui/material';

interface CarouselContainerProps extends BoxProps {
  showDots?: boolean;
  title?: string;
  fixedItemWidth?: boolean;
}

export const CarouselContainer = styled(Box, {
  shouldForwardProp: (prop: string) =>
    !['title', 'showDots', 'fixedItemWidth'].includes(prop),
})<CarouselContainerProps>(({ theme, showDots, title, fixedItemWidth }) => ({
  ...(title && { position: 'relative' }),
  ...(showDots && { marginBottom: theme.spacing(5) }),
  maxWidth: '100%',
  '.carousel-swiper': {
    padding: theme.spacing(0, 4), // Add padding for navigation buttons
    marginTop: theme.spacing(3),
    ...(showDots && { paddingBottom: theme.spacing(6) }),
  },

  // Custom pagination styles
  '.swiper-pagination': {
    position: 'absolute',
    alignItems: 'center',
    bottom: `${theme.spacing(-3.5)}!important`,
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    padding: 0,
    margin: 0,
    listStyle: 'none',
    left: '50% !important',
    transform: 'translateX(-50%) !important',

    [theme.breakpoints.up('sm' as Breakpoint)]: {
      bottom: `${theme.spacing(-4.5)}!important`,
    },

    [theme.breakpoints.up('lg' as Breakpoint)]: {
      bottom: `${theme.spacing(-5.5)}!important`,
    },

    '.swiper-pagination-bullet': {
      // border: 'none',
      background: theme.palette.alphaDark100.main,
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      margin: '0 5px',
      padding: 0,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      opacity: 1,
    },

    '.swiper-pagination-bullet-active': {
      backgroundColor: `${theme.palette.primary.main} !important`,
      border: 'none',
      width: '10px !important',
      height: '10px !important',
    },
  },

  '.carousel-slide': {
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      ...(fixedItemWidth && { width: 'auto !important' }),
    },
  },
}));

export const CarouselHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(1.5),
  color: (theme.vars || theme).palette.text.primary,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginTop: 0,
  },
}));

export const CarouselLabel = styled(Box)(({ theme }) => ({}));

export interface CarouselNavigationContainerProps extends BoxProps {
  hide?: boolean;
}

export const CarouselNavigationContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hide',
})<CarouselNavigationContainerProps>(({ theme }) => ({
  display: 'flex',
  position: 'absolute',
  height: 40,
  top: -4,
  right: 0,
  [theme.breakpoints.up('md')]: {
    marginLeft: 3,
  },
  variants: [
    {
      props: ({ hide }) => hide,
      style: {
        [theme.breakpoints.up('md')]: { display: 'none' },
      },
    },
  ],
}));

export const CarouselNavigationButton = styled(IconButtonSecondary)(() => ({
  width: 40,
  height: 40,
  fontSize: 22,
}));

export const CarouselCenteredBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
