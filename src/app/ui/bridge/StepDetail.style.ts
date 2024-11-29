'use client';

import type { BoxProps, Breakpoint } from '@mui/system';
import { Box, styled } from '@mui/system';

interface StepDetailContainerProps {
  imgWidth: number;
}

export const StepDetailContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'imgWidth',
})<StepDetailContainerProps>(({ theme, imgWidth }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),

  [theme.breakpoints.up('lg' as Breakpoint)]: {
    ...(imgWidth <= 600 && { flexDirection: 'row' }),
    gap: theme.spacing(6),
  },
}));

export const StepDetailInfo = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  minWidth: '50%',
}));
