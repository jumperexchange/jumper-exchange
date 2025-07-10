import { IconButtonSecondary } from '@/components/IconButton.style';
import type { BoxProps, Breakpoint } from '@mui/material';
import { Box, styled } from '@mui/material';
import { keyframes } from '@mui/material/styles';

interface CarouselContainerProps extends BoxProps {
  hasPagination?: boolean;
  title?: string;
  fixedSlideWidth?: boolean;
}

export const CarouselContainer = styled(Box, {
  shouldForwardProp: (prop: string) =>
    !['title', 'hasPagination', 'fixedSlideWidth'].includes(prop),
})<CarouselContainerProps>(
  ({ theme, hasPagination, title, fixedSlideWidth }) => ({
    ...(title && { position: 'relative' }),
    ...(hasPagination && { marginBottom: theme.spacing(5) }),
    maxWidth: '100%',
    '.carousel-swiper': {
      padding: theme.spacing(0, 4), // Add padding for navigation buttons
      marginTop: theme.spacing(3),
      ...(hasPagination && { paddingBottom: theme.spacing(6) }),
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
        background: `${(theme.vars || theme).palette.alphaLight700.main} !important`,
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        margin: '0 5px',
        padding: 0,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        opacity: 1,
        ...theme.applyStyles('light', {
          background: `${(theme.vars || theme).palette.alphaDark700.main} !important`,
        }),
      },

      '.swiper-pagination-bullet-active': {
        backgroundColor: `${(theme.vars || theme).palette.primary.main} !important`,
        border: 'none',
        // width: '10px !important',
        // height: '10px !important',
      },
    },

    '.carousel-slide': {
      [theme.breakpoints.up('sm' as Breakpoint)]: {
        ...(fixedSlideWidth && { width: 'auto !important' }),
      },
    },
  }),
);

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
  zIndex: 10,
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

export const fillBullet = keyframes`
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
`;

interface AnimatedPaginationRootProps {
  delay?: number;
}

export const AnimatedPaginationContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'delay',
})<AnimatedPaginationRootProps>(({ theme }) => ({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,

  '&.swiper-pagination': {
    bottom: `-16px !important`,
  },

  '&.swiper-pagination .swiper-pagination-bullet': {
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.alphaDark300.main,
    }),
  },

  '&.swiper-pagination .swiper-pagination-bullet-active': {
    width: '64px !important',
    borderRadius: '4px !important',
    position: 'relative',
    backgroundColor: `${(theme.vars || theme).palette.alphaLight300.main} !important`,
    ...theme.applyStyles('light', {
      backgroundColor: `${(theme.vars || theme).palette.alphaDark300.main} !important`,
    }),
  },

  '& .swiper-pagination-bullet.swiper-pagination-bullet-active::before': {
    content: '""',
    position: 'absolute',
    borderRadius: '8px',
    left: 0,
    top: 0,
    width: '0%',
    height: '100%',
    backgroundColor: (theme.vars || theme).palette.accent1.main,
    animation: `${fillBullet} 5s linear forwards`,
  },
}));

export const FloatingNavigationContainer = styled(CarouselNavigationContainer, {
  shouldForwardProp: (prop) => prop !== 'hide',
})<CarouselNavigationContainerProps>(({ theme }) => ({
  height: 40,
  width: '100%',
  position: 'absolute',
  top: '50%',
  right: 0,
  transform: 'translateY(-50%)',
  zIndex: 10,
  display: 'flex',
  justifyContent: 'space-between',
}));

export const FloatingNavigationButton = styled(IconButtonSecondary)(
  ({ theme }) => ({
    width: 40,
    height: 40,
    fontSize: 22,
    border: `2px solid ${(theme.vars || theme).palette.surface2.main}`,
    backgroundColor: (theme.vars || theme).palette.surface1.main,
  }),
);
