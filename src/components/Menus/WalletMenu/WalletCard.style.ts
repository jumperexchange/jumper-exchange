'use client';

import { ButtonTransparent } from '@/components/Button';
import type { Breakpoint } from '@mui/material';
import { Avatar, Badge, Container } from '@mui/material';
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button/Button';
import { styled } from '@mui/material/styles';

export const WalletAvatar = styled(Avatar)(({ theme }) => ({
  margin: 'auto',
  height: 40,
  width: 40,
  backgroundColor: 'transparent',

  '> img': {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
  },
  // mask: avatarMask32,
}));

export const WalletCardContainer = styled(Container)(({ theme }) => ({
  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.04)',
  display: 'flex',
  background: theme.palette.surface2.main,
  borderRadius: '16px',
  padding: theme.spacing(2),
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
    '+ .MuiBadge-badge .MuiAvatar-root': {
      // border: '2px solid white',
    },
    // mask: avatarMask32,
  },
}));

export const Button = styled(ButtonTransparent)<MuiButtonProps>(
  ({ theme }) => ({
    minWidth: 'auto',
    backgroundColor: theme.palette.bgQuaternary.main,
    '&:hover': {
      backgroundColor: theme.palette.bgQuaternary.hover,
    },
  }),
);

export const WalletChainAvatar = styled(Avatar)(({ theme }) => ({
  borderRadius: '50%',
  border: `2px solid ${theme.palette.surface2.main}`,
  '> .MuiAvatar-root': {
    '+ .MuiBadge-badge .MuiAvatar-root': {
      border: `2px solid ${theme.palette.surface2.main}`,
    },
  },
}));
