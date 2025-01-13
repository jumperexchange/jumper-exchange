'use client';

import { ButtonSecondary, ButtonTransparent } from '@/components/Button';
import { avatarMask32 } from '@/components/Mask.style';
import type { Breakpoint, ButtonProps } from '@mui/material';
import { alpha, Avatar, Badge, Container, Drawer } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface WalletButtonProps extends ButtonProps {
  colored?: boolean;
}

export const CustomDrawer = styled(Drawer)(({ theme }) => ({
  zIndex: 2000,
  '& .MuiDrawer-paper': {
    width: '100%',
    padding: '1.25rem',
    boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)',
    gap: theme.spacing(2),
    maxWidth: 416,
    zIndex: 2000,
    background: theme.palette.surface1.main, // theme.palette.surface2.main into the figma, which is not matching the right color, might need to be updated
  },
}));

export const AvatarContainer = styled('div')(() => ({
  position: 'relative',
  width: 'fit-content',
  margin: 'auto',
}));

export const WalletAvatar = styled(Avatar)(({ theme }) => ({
  margin: 'auto',
  height: 88,
  width: 88,
  '> img': {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
  },
  mask: avatarMask32,
}));

export const ChainAvatar = styled(Avatar)(({ theme }) => ({
  height: 44,
  width: 44,
  position: 'absolute',
  padding: theme.spacing(0.75),
  right: theme.spacing(-2.25),
  bottom: -6,
  borderRadius: '24px',
  background: 'white',
  img: {
    borderRadius: '23px',
  },
}));

export const WalletButton = styled(ButtonTransparent)<WalletButtonProps>(
  ({ theme }) => ({
    borderRadius: '24px',
    padding: '10px 24px',
    height: 40,
    width: '100%',
    background: alpha(theme.palette.text.primary, 0.04),
    '&:hover': {
      backgroundColor: alpha(theme.palette.text.primary, 0.08),
    },
  }),
);

export const WalletButtonSecondary = styled(ButtonSecondary, {
  shouldForwardProp: (prop) => prop !== 'colored',
})<WalletButtonProps>(({ theme }) => ({
  borderRadius: '24px',
  padding: '10px 24px',
  width: '100%',
  gridColumn: '2/3',
  gridRow: '2/3',
}));

export const WalletCardContainer = styled(Container)(({ theme }) => ({
  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.04)',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  background: theme.palette.surface2.main,
  borderRadius: '16px',
  [theme.breakpoints.down('sm' as Breakpoint)]: {
    padding: '10px',
  },
}));

export const WalletCardButtonContainer = styled(Container)(({ theme }) => ({
  display: 'grid',
  gridTemplateRows: 'repeat(2, auto)',
  gridTemplateColumns: '1fr 1fr 1fr',
  gridGap: '12px',
  justifyItems: 'center',
  alignItems: 'center',
  width: 'fit-content',
  padding: '0 !important',
  margin: 0,
}));

export const WalletCardBadge = styled(Badge)(({ theme }) => ({
  borderRadius: '50%',
  '> .MuiAvatar-root': {
    mask: avatarMask32,
  },
}));
