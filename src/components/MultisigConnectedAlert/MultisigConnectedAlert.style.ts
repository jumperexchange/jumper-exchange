'use client';

import { InfoRounded } from '@mui/icons-material';
import type { Breakpoint } from '@mui/material';
import { Box, Button, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';

export const MultisigConnectedAlertContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  color: (theme.vars || theme).palette.text.primary,
  top: 64,
  left: '50%',
  transform: 'translateX(-50%)',
  width: 416,
  [theme.breakpoints.up('sm' as Breakpoint)]: { top: 72 },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  borderRadius: '16px',
  background:
    (theme.vars || theme).palette.surface2.main,
  boxShadow: (theme.vars || theme).shadows[1],
  ...theme.applyStyles("light", {
    background: (theme.vars || theme).palette.surface1.main
  })
}));

export const MultisigConnectedAlertButton = styled(Button)(({ theme }) => ({
  width: '100%',
  borderRadius: '24px',
  fontWeight: 700,
  padding: theme.spacing(1.25, 0),
}));

export const MultisigConnectedAlertIconContainer = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.info.main, 0.12),
  borderRadius: '100%',
  height: 96,
  width: 96,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

export const MultisigConnectedAlertIcon = styled(InfoRounded)(({ theme }) => ({
  margin: theme.spacing(3),
  height: 48,
  width: 48,
  color: (theme.vars || theme).palette.info.main,
  zIndex: 2,
}));
