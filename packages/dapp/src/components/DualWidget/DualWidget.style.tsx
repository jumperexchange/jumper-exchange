import { Grid, GridProps } from '@mui/material';
import { Breakpoint, styled } from '@mui/material/styles';

export interface WidgetContainerProps extends Omit<GridProps, 'component'> {
  isActive?: boolean;
  showWelcome?: boolean;
}

export const WidgetContainer = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'showWelcome',
})<WidgetContainerProps>(({ theme, isActive, showWelcome }) => ({
  display: isActive ? 'inherit' : 'none',
  paddingTop: theme.spacing(2),
  '& > div': {
    height: showWelcome && 'inherit !important',
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    paddingTop: theme.spacing(2),
  },
}));
