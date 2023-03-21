import { Box, BoxProps } from '@mui/material';
import { Breakpoint, styled } from '@mui/material/styles';

export interface WidgetContainerProps extends Omit<BoxProps, 'component'> {
  isActive?: boolean;
}

export const WidgetContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<WidgetContainerProps>(({ theme, isActive }) => ({
  display: isActive ? 'inherit' : 'none',
  paddingTop: theme.spacing(2),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    paddingTop: theme.spacing(2),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    paddingTop: theme.spacing(7),
  },
}));
