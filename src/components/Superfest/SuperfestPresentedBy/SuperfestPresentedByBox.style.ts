'use client';
import type { Breakpoint } from '@mui/material';
import { styled, type BoxProps } from '@mui/material';

export interface ContainerProps extends BoxProps {
  variant?: 'xs' | 'md' | 'lg';
}
export const SuperFestPoweredContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isArticlePage',
})<ContainerProps>(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    position: 'static',
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    marginLeft: theme.spacing(2),
    zIndex: 1,
    '.link-jumper': {
      fontWeight: '700',
      color:
        theme.palette.mode === 'light'
          ? theme.palette.accent1.main
          : theme.palette.accent1Alt.main,
      textDecoration: 'none',
    },
  },
}));
