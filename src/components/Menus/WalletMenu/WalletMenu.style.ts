'use client';

import { ButtonTransparent } from '@/components/Button';
import type { ButtonProps } from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import { styled, alpha } from '@mui/material/styles';

export const CustomDrawer = styled(Drawer)(({ theme }) => ({
  zIndex: 2000,
  '& .MuiDrawer-paper': {
    width: '100%',
    padding: '1.25rem',
    boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)',
    gap: theme.spacing(2),
    maxWidth: 416,
    zIndex: 2000,
    background: (theme.vars || theme).palette.surface1.main, // (theme.vars || theme).palette.surface2.main into the figma, which is not matching the right color, might need to be updated
  },
}));

export interface WalletButtonProps extends ButtonProps {
  colored?: boolean;
}

export const WalletButton = styled(ButtonTransparent)<WalletButtonProps>(
  ({ theme }) => ({
    borderRadius: '24px',
    padding: '11px 16px',
    height: 40,
    width: '100%',
    background: alpha(theme.palette.white.main, 0.04),
    ...theme.applyStyles('light', {
      background: alpha(theme.palette.black.main, 0.04),
    }),
    '&:hover': {
      backgroundColor: alpha(theme.palette.white.main, 0.08),

      ...theme.applyStyles('light', {
        backgroundColor: alpha(theme.palette.black.main, 0.08),
      }),
    },
  }),
);
