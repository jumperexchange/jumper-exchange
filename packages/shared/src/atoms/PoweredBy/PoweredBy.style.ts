import type { Breakpoint } from '@mui/material';
import { styled, type BoxProps } from '@mui/material';

export interface ContainerProps extends Omit<BoxProps, 'variant'> {
  variant?: 'xs' | 'md' | 'lg';
  cardsLayout?: boolean;
}
//, {  shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'cardsLayout',}
export const Container = styled('div')<ContainerProps>(({ theme }) => ({
  display: 'none',

  [theme.breakpoints.up('md' as Breakpoint)]: {
    position: 'fixed',
    bottom: '22px',
    right: '24px',
    display: 'block',

    '.link-lifi': {
      fontWeight: '700',
      color: theme.palette.primary.main,
      textDecoration: 'none',
    },
  },
}));
