'use client';

import { ButtonPrimary, ButtonTransparent } from '@/components/Button';
import { avatarMask14 } from '@/components/Mask.style';
import { Avatar, Badge } from '@mui/material';
import type { Breakpoint } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { getContrastAlphaColor } from 'src/utils';

export const WalletMgmtAvatarContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  marginRight: theme.spacing(1.5),
}));

export const WalletMgmtWalletAvatar = styled(Avatar)(({ theme }) => ({
  height: 32,
  width: 32,
  // padding: theme.spacing(0.5),
  mr: theme.spacing(1),
  ml: theme.spacing(0.25),
  [theme.breakpoints.up('md' as Breakpoint)]: {
    mr: theme.spacing(0),
    ml: theme.spacing(0),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    mr: theme.spacing(1),
    ml: theme.spacing(0.25),
  },
}));

export const ConnectButton = styled(ButtonPrimary)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(3),
    display: 'inline-flex !important',
  },
}));

export const WalletMenuButton = styled(ButtonTransparent)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.alphaLight300.main
      : theme.palette.white.main,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.alphaLight300.main
        : theme.palette.white.main,
  },
  '&:hover:before': {
    content: '" "',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    transition: 'background-color 250ms',
    background: getContrastAlphaColor(theme, '4%'),
  },
}));

export const WalletMgmtBadge = styled(Badge)(({ theme }) => ({
  borderRadius: '50%',
  // overflow: 'hidden',
  '> .MuiAvatar-root': {
    mask: avatarMask14,
  },
}));

export const WalletMgmtChainAvatar = styled(Avatar)(({ theme }) => ({
  width: 14,
  height: 14,
  border: '1.5px solid transparent',
  borderRadius: '10px',
  background: 'transparent',
  left: 1.5,
  top: 0.5,
  img: {
    borderRadius: '50%',
  },
}));

// radial-gradient(circle 8px at calc(100% - 4px) calc(100% - 4px),var(--g)) 100% 100%/var(--s)
