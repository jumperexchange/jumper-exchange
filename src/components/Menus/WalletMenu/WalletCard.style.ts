'use client';

import { ButtonSecondary, ButtonTransparent } from '@/components/Button';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';

export const WalletAvatar = styled(Avatar)(() => ({
  margin: 'auto',
  height: 40,
  width: 40,
  backgroundColor: 'transparent',
  '> img': {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
  },
}));

export const WalletCardContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
}));

export const WalletContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
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
  margin: 0,
}));

export const WalletCardBadge = styled(Badge)(() => ({
  borderRadius: '50%',
  '> .MuiAvatar-root': {
    '+ .MuiBadge-badge .MuiAvatar-root': {
      // border: '2px solid white',
    },
    // mask: avatarMask32,
  },
}));

export const WalletCardButton = styled(ButtonTransparent)(({ theme }) => ({
  padding: theme.spacing(0.75),
  minWidth: 'auto',
  backgroundColor: (theme.vars || theme).palette.buttonAlphaDarkBg,
  color: (theme.vars || theme).palette.buttonAlphaDarkAction,
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.buttonAlphaDarkBg,
    color: (theme.vars || theme).palette.buttonAlphaDarkAction,
  }),

  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.buttonActiveBg,
    color: (theme.vars || theme).palette.buttonActiveAction,
  },
}));

export const WalletCardButtonSecondary = styled(ButtonSecondary)(
  ({ theme }) => ({
    padding: theme.spacing(0.75),
    minWidth: 'auto',
    backgroundColor: (theme.vars || theme).palette.buttonSecondaryBg,
    color: (theme.vars || theme).palette.buttonSecondaryAction,
  }),
);

export const WalletChainAvatar = styled(Avatar)(({ theme }) => ({
  borderRadius: '50%',
  border: `2px solid ${(theme.vars || theme).palette.surface2.main}`,
  '> .MuiAvatar-root': {
    '+ .MuiBadge-badge .MuiAvatar-root': {
      border: `2px solid ${(theme.vars || theme).palette.surface2.main}`,
    },
  },
}));
