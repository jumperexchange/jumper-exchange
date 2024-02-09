'use client';

import { Button, Container, darken, styled } from '@mui/material';

export const SVMConnectButton = styled(Button)(({ theme }) => ({
  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.04)',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: ' 1 0 0',
  cursor: 'pointer',
  backgroundColor: theme.palette.surface2.main,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.alphaLight300.main
        : darken(theme.palette.white.main, 0.08),
  },
}));

export const SVMConnectButtonContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: '16px',
  alignSelf: 'stretch',
  background: theme.palette.surface1.main,
}));
