'use client';

import type { BoxProps, Breakpoint } from '@mui/system';
import { Box, styled } from '@mui/system';

export const StepDetailContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),

  [theme.breakpoints.up('lg' as Breakpoint)]: {
    gap: theme.spacing(6),
  },
}));

export const StepDetailInfo = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  minWidth: '50%',
}));
