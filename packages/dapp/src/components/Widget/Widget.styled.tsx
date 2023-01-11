import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface WidgetContainerProps extends Omit<BoxProps, 'component'> {
  isActive?: boolean;
}

export const WidgetContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<WidgetContainerProps>(({ theme, isActive }) => ({
  display: isActive ? 'inherit' : 'none',
  // visibility: isActive ? 'visible' : 'hidden',
  marginTop: theme.spacing(4),
  paddingTop: theme.spacing(4),
  flex: '1 1 0%',
  // make widget scrollable on screens smaller than:
  // 80px (navbar height)
  // + 32px (margin-top of widget)
  // + 680px (height of widget)
  [`@media (max-height: ${80 + 18 + 680}px)`]: {
    overflowY: 'auto',
    height: 'calc( 100vh - 80px - 18px)',
    width: '100vw',
    '> div': {},
  },
}));
