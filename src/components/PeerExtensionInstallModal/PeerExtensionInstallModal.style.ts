'use client';

import { ExtensionRounded } from '@mui/icons-material';
import type { Breakpoint } from '@mui/material';
import { Box, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PeerExtensionInstallModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  color: (theme.vars || theme).palette.text.primary,
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: 416,
  [theme.breakpoints.down('sm' as Breakpoint)]: {
    width: 'calc(100% - 32px)',
  },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  borderRadius: '16px',
  background: (theme.vars || theme).palette.surface2.main,
  boxShadow: (theme.vars || theme).shadows[1],
  ...theme.applyStyles('light', {
    background: (theme.vars || theme).palette.surface1.main,
  }),
}));

export const PeerExtensionInstallModalIconContainer = styled(Box)(
  ({ theme }) => ({
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    borderRadius: '100%',
    height: 96,
    width: 96,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  }),
);

export const PeerExtensionInstallModalIcon = styled(ExtensionRounded)(
  ({ theme }) => ({
    height: 48,
    width: 48,
    color: (theme.vars || theme).palette.primary.main,
  }),
);
