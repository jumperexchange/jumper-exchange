'use client';

import type { BoxProps } from '@mui/system';
import { Box, styled } from '@mui/system';
import type { Breakpoint } from '@mui/material/styles';

export const BridgePageContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<BoxProps>(({ theme }) => ({
  color: theme.palette.text.primary,
  position: 'relative',
  borderRadius: 32,
  backgroundColor: theme.palette.bgSecondary.main,
  transition: 'background-color 250ms',
  boxShadow: theme.palette.shadow.main,
  display: 'flex',
  textDecoration: 'none',
  flexDirection: 'column',
  padding: theme.spacing(2),
  margin: theme.spacing(4, 2, 0),

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(6, 8, 0),
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: theme.spacing(4),
  },

  [theme.breakpoints.up('lg' as Breakpoint)]: {
    padding: theme.spacing(8),
    minHeight: 500,
    gap: theme.spacing(8),
    gridTemplateRows: '1fr',
    gridTemplateColumns: '54% 1fr',
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    margin: theme.spacing(6, 'auto', 0),
    maxWidth: theme.breakpoints.values.xl,
    minHeight: 600,
  },
}));
