import { Box, BoxProps } from '@mui/material';
import { Breakpoint, styled } from '@mui/material/styles';

export interface WidgetContainerProps extends Omit<BoxProps, 'component'> {
  isActive?: boolean;
}

export const WidgetContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<WidgetContainerProps>(({ theme, isActive }) => ({
  display: isActive ? 'inherit' : 'none',
  paddingTop: theme.spacing(18),
  flex: '1 1 0%',
  width: '100vw',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    paddingTop: theme.spacing(20),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    paddingTop: theme.spacing(26),
  },
  [`@media (max-height: ${80 + 18 + 680}px)`]: {
    overflowY: 'auto',
  },
}));
