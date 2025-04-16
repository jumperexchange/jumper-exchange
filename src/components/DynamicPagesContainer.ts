'use client';

import type { BoxProps } from '@mui/material';
import { Box, styled } from '@mui/material';

export const DynamicPagesContainer = styled(Box)<BoxProps>(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  position: 'relative',
  borderRadius: 32,
  backgroundColor: (theme.vars || theme).palette.bgSecondary.main,
  transition: 'background-color 250ms',
  boxShadow: (theme.vars || theme).shadows[1],
  display: 'flex',
  textDecoration: 'none',
  flexDirection: 'column',
  padding: theme.spacing(4),
  margin: theme.spacing(2, 0),
  width: '100%',
}));
