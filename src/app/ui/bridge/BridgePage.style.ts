'use client';

import { Box, styled } from '@mui/system';

export const BridgePageContainer = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
  position: 'relative',
  borderRadius: 32,
  backgroundColor: theme.palette.bgSecondary.main,
  transition: 'background-color 250ms',
  boxShadow: theme.palette.shadow.main,
  display: 'flex',
  textDecoration: 'none',
  flexDirection: 'column',
  padding: theme.spacing(4),
  margin: theme.spacing(2, 0),
}));
