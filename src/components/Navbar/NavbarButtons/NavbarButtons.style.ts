'use client';

import { ButtonSecondary } from '@/components/Button/Button.style';
import type { ButtonProps } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import MuiMoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MuiMenuIcon from '@mui/icons-material/Menu';

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
    ':hover:before': {
      backgroundColor: alpha(theme.palette.white.main, 0.12),
      ...theme.applyStyles('light', {
        backgroundColor: (theme.vars || theme).palette.alphaDark100.main,
      }),
    },
    '&[aria-expanded="true"]': {
      backgroundColor: (theme.vars || theme).palette.alphaLight600.main,
    },
    ':hover': {
      backgroundColor: (theme.vars || theme).palette.alphaLight600.main,
    },
    ...theme.applyStyles('light', {
      color: (theme.vars || theme).palette.primary.main,
      '&[aria-expanded="true"]': {
        backgroundColor: (theme.vars || theme).palette.white.main,
        boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
      },
      ':hover': {
        backgroundColor: (theme.vars || theme).palette.white.main,
        boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
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

export const HamburgerMenuIcon = styled(MuiMenuIcon)(({ theme }) => ({
  fontSize: '24px',
  color: theme.palette.white.main,
  ...theme.applyStyles('light', {
    color: theme.palette.black.main,
  }),
}));
