'use client';
import type { Breakpoint } from '@mui/material';
import { styled, type BoxProps } from '@mui/material';

export interface ContainerProps extends Omit<BoxProps, 'variant'> {
  variant?: 'xs' | 'md' | 'lg';
}
//, {  shouldForwardProp: (prop) => prop !== 'variant' && prop !== 'cardsLayout',}
export const SuperFestPoweredContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isArticlePage',
})<ContainerProps>(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    position: 'static',
    display: 'flex',
    justifyContent: 'flex-start',
    // marginRight: theme.spacing(3),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    marginLeft: theme.spacing(2),
    [theme.breakpoints.up('sm' as Breakpoint)]: {},
    zIndex: 1,
    '.link-jumper': {
      fontWeight: '700',
      color: theme.palette.accent1Alt.main,
      textDecoration: 'none',
      ...theme.applyStyles('light', {
        color: theme.palette.accent1.main,
      }),
    },
  },
}));
