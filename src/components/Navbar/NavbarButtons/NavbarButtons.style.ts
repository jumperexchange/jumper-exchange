'use client';

import { ButtonSecondary } from '@/components/Button/Button.style';
import type { ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiMoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Stack from '@mui/system/Stack';

export const NavbarButtonsContainer = styled('div')({
  display: 'flex',
  flex: 1,
  justifySelf: 'self-end',
  justifyContent: 'flex-end',
});

export const MenuToggle = styled(ButtonSecondary)<ButtonProps>(({ theme }) => {
  return {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    color: (theme.vars || theme).palette.accent1Alt.main,
    width: 48,
    borderRadius: '50%',
    marginLeft: theme.spacing(1.5),
    minWidth: 'unset',
    height: 48,
    '&[aria-expanded="true"]': {
      backgroundColor: (theme.vars || theme).palette.alphaLight500.main,
    },
    ':hover': {
      backgroundColor: (theme.vars || theme).palette.alphaLight500.main,
    },
    ...theme.applyStyles('light', {
      color: (theme.vars || theme).palette.primary.main,
      '&[aria-expanded="true"]': {
        backgroundColor: (theme.vars || theme).palette.white.main,
        boxShadow: theme.shadows[2],
      },
      ':hover': {
        backgroundColor: (theme.vars || theme).palette.white.main,
        boxShadow: theme.shadows[2],
      },
    }),
  };
});

export const DotsMenuIcon = styled(MuiMoreHorizIcon)(({ theme }) => ({
  fontSize: '24px',
  color: theme.palette.white.main,
  ...theme.applyStyles('light', {
    color: theme.palette.black.main,
  }),
}));

export const FloatingLinksContainer = styled(Stack)(({ theme }) => ({
  left: 0,
  right: 0,
  position: 'fixed',
  zIndex: theme.zIndex.appBar,
  bottom: theme.spacing(1.25),
  margin: theme.spacing(0, 2),
  padding: theme.spacing(1.25, 1.5),
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  backgroundColor: (theme.vars || theme).palette.surface3.main,
  boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)',
  borderRadius: 64,
}));

export const LinksContainer = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(4),
}));
