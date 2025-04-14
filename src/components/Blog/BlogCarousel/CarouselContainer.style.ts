import { IconButtonSecondary } from '@/components/IconButton.style';
import type { BoxProps, Breakpoint } from '@mui/material';
import { Box, styled } from '@mui/material';

export const CarouselContainerBox = styled(Box)(({ theme }) => ({
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
}));

export const CarouselHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(1.5),
  justifyContent: 'space-between',
  color: theme.palette.text.primary,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginTop: 0,
  },
}));

export interface CarouselNavigationContainerProps extends BoxProps {
  hide?: boolean;
}

export const CarouselNavigationContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'hide',
})<CarouselNavigationContainerProps>(({ theme }) => ({
  display: 'flex',
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
