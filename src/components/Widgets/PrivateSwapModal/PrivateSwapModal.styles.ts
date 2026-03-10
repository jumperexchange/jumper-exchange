'use client';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PrivateSwapModalCard = styled(Box)(({ theme }) => ({
  width: 'min(400px, calc(100vw - 32px))',
  maxWidth: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  borderRadius: theme.shape.radius16,
  background: (theme.vars || theme).palette.surface2.main,
  boxShadow: (theme.vars || theme).shadows[1],
  ...theme.applyStyles('light', {
    background: (theme.vars || theme).palette.surface1.main,
  }),
}));
