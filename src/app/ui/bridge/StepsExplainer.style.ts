'use client';

import { styled } from '@mui/system';

export const StepDetailContentList = styled('ul')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  flexWrap: 'wrap',
  justifyContent: 'center',
}));
