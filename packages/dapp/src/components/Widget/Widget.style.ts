import { Box, BoxProps, Breakpoint, styled } from '@mui/material';
import { hoverOffset } from '../Widgets/Widgets.style';

export interface WidgetWrapperProps extends Omit<BoxProps, 'component'> {
  welcomeScreenClosed: boolean;
}

export const WidgetWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'welcomeScreenClosed',
})<WidgetWrapperProps>(({ theme, welcomeScreenClosed }) => ({
  minWidth: '392px',
  position: 'relative',
  overflow: 'hidden',
  gridRow: '3 / 3',
  // maxHeight: !welcomeScreenClosed ? 'calc( 50vh - 80px )' : '100%',
  marginTop: hoverOffset,
  transition: 'margin-top 0.3s ease-in-out' /* 3 */,

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    gridRow: '3 / 3',
    // maxHeight: 'inherit',
  },

  [`@media screen and (min-height: 900px)`]: {},

  ...(!welcomeScreenClosed && {
    '&:hover': {
      marginTop: 0,
    },

    iframe: {
      ...(!welcomeScreenClosed && { pointerEvents: 'none' }),
    },
  }),
}));

export const GlowBackground = styled('span')(({ theme }) => ({
  position: 'absolute',
  opacity: 0,
  zIndex: -1,
  minWidth: '440px',
  minHeight: '440px',
  width: '50vw',
  height: '50vw',
  transform: 'translateX(-50%)',
  left: '50%',
  top: '80px',
}));
