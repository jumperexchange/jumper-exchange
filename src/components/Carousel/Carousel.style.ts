import { IconButtonSecondary } from '@/components/IconButton.style';
import type { BoxProps, Breakpoint } from '@mui/material';
import { Box, styled } from '@mui/material';

interface CarouselContainerProps extends BoxProps {
  showDots?: boolean;
  title?: string;
}

export const CarouselContainer = styled(Box, {
  shouldForwardProp: (prop: string) => !['title', 'showDots'].includes(prop),
})<CarouselContainerProps>(({ theme, showDots, title }) => ({
  ...(title && { position: 'relative' }),

  // Simplified carousel styles to match CarouselTest
  '.carousel-container': {
    // overflow: 'hidden',
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(3, 0),
    ...(showDots && { paddingBottom: theme.spacing(6) }),
  },

  // Override the carousel item width to accommodate 416px content
  '.react-multi-carousel-item': {
    margin: '0 16px',
  },

  // Ensure the track can handle the wider items
  // '.react-multi-carousel-track': {
  //   gap: '16px', // Add gap between items
  // },

  // '.carousel-item': {
  //   display: 'flex',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width: '416px', // Set explicit width
  // },

  '.carousel-button-group': {
    position: 'absolute',
    height: '40px',
    top: -4,
  },

  '.custom-dot-list-style': {
    position: 'absolute',
    bottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    padding: 0,
    margin: 0,
    listStyle: 'none',

    '& .react-multi-carousel-dot button': {
      border: 'none !important',
      background: `${theme.palette.alphaDark100.main} !important`,
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      margin: '0 5px',
      padding: 0,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },

    '& .react-multi-carousel-dot--active button': {
      backgroundColor: `${theme.palette.alphaDark500.main} !important`,
      border: 'none',
      width: '10px',
      height: '10px',
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
  height: '32px',
  top: 0,
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
