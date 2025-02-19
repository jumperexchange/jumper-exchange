import type { Breakpoint } from '@mui/material';

import { styled } from '@mui/material/styles';

export const ArticlesGrid = styled('div')(({ theme }) => ({
  margin: theme.spacing(2, 'auto'),
  display: 'grid',
  paddingBottom: 0,
  gridTemplateColumns: '1fr',
  justifyItems: 'center',
  gap: theme.spacing(3),
  [theme.breakpoints.up('md' as Breakpoint)]: {
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(4),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    gridTemplateColumns: '1fr 1fr 1fr',
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    maxWidth: theme.breakpoints.values.xl,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));
