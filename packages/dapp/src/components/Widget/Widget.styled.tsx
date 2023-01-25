import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface WidgetContainerProps extends Omit<BoxProps, 'component'> {
  isActive?: boolean;
}

export const WidgetContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<WidgetContainerProps>(({ theme, isActive }) => ({
  display: isActive ? 'inherit' : 'none',
  paddingTop: theme.spacing(2),
  marginTop: theme.spacing(2),
  height: 'calc( 100vh - 64px - 8px )',
  flex: '1 1 0%',
  // make widget scrollable on screens smaller than:
  // 80px (navbar height)
  // + 32px (margin-top of widget)
  // + 680px (height of widget)
  [`@media (max-height: ${80 + 18 + 680}px)`]: {
    overflowY: 'auto',
    height: 'calc( 100vh - 72px - 16px)',
    width: '100vw',
    '> div': {},
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(4),
      paddingTop: theme.spacing(4),
      height: 'calc( 100vh - 64px - 16px )',
    },
    [theme.breakpoints.up('md')]: {
      height: 'calc( 100vh - 80px - 16px )',
    },
  },
}));
