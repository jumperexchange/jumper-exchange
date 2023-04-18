import { Grid, GridProps } from '@mui/material';
import { Breakpoint, styled } from '@mui/material/styles';

export interface WidgetContainerProps extends Omit<GridProps, 'component'> {
  isActive?: boolean;
}

export const WidgetContainer = styled(Grid, {
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
