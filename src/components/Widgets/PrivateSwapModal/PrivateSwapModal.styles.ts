'use client';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PrivateSwapModalCard = styled(Box)(({ theme }) => ({
  width: 400,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  borderRadius: '16px',
  background: (theme.vars || theme).palette.surface2.main,
  boxShadow: (theme.vars || theme).shadows[1],
  ...theme.applyStyles('light', {
    background: (theme.vars || theme).palette.surface1.main,
  }),
}));
