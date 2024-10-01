'use client';

import { ButtonSecondary, ButtonTransparent } from '@/components/Button';
import { avatarMask32 } from '@/components/Mask.style';
import { Avatar, Badge, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

export const AvatarContainer = styled('div')(() => ({
  position: 'relative',
  width: 'fit-content',
  margin: 'auto',
}));

export const WalletAvatar = styled(Avatar)(() => ({
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

export const WalletButton = styled(ButtonTransparent)(() => ({
  borderRadius: '24px',
  padding: '10px 24px',
  width: '100%',
}));

export const WalletButtonSecondary = styled(ButtonSecondary)(() => ({
  borderRadius: '24px',
  padding: '10px 24px',
  width: '100%',
  gridColumn: '2/3',
  gridRow: '2/3',
}));

export const WalletCardContainer = styled(Container)(({ theme }) => ({
  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.04)',
  padding: '24px',
  display: 'flex',
  background: theme.palette.surface2.main,
  borderRadius: '16px',
}));

export const WalletCardButtonContainer = styled(Container)(() => ({
  display: 'grid',
  gridTemplateRows: 'repeat(2, auto)',
  gridTemplateColumns: '1fr 1fr 1fr',
  gridGap: '12px',
  justifyItems: 'center',
  alignItems: 'center',
  width: 'fit-content',
  padding: '0 !important',
}));

export const WalletCardBadge = styled(Badge)(() => ({
  borderRadius: '50%',
  '> .MuiAvatar-root': {
    mask: avatarMask32,
  },
}));
