'use client';

import type { Shadows } from '@mui/material';
import type { BoxProps } from '@mui/system';
import { Box, styled } from '@mui/system';

export const BridgePageContainer = styled(Box)<BoxProps>(({ theme }) => ({
  color: theme.palette.text.primary,
  maxWidth: '100%',
  flexGrow: 1,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: 32,
  backgroundColor: theme.palette.bgSecondary.main,
  transition: 'background-color 250ms',
  boxShadow: (theme.shadows as Shadows)[1],
  display: 'flex',
  textDecoration: 'none',
  flexDirection: 'column',
  padding: theme.spacing(4),
  margin: theme.spacing(2, 0),
}));
