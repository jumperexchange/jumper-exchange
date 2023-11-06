import { Box, BoxProps, styled } from '@mui/material';

export interface WidgetContainerProps extends Omit<BoxProps, 'component'> {
  isActive?: boolean;
}

export const WidgetContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<WidgetContainerProps>(({ theme, isActive }) => ({
  display: isActive ? 'inherit' : 'none',
  margin: '0 auto 24px',

  '& > .widget-wrapper > div, & > .onramper-wrapper': {
    overflow: 'hidden',
    paddingTop: theme.spacing(3.5),
  },

  '& > .widget-wrapper, & > .onramper-wrapper': {
    // transitionProperty: 'margin-top, padding-top, transform',
    // transitionDuration: '.3s',
    // transitionTimingFunction: 'ease-in-out',
  },
}));
