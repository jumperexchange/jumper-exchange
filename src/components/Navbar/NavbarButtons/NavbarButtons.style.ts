'use client';

import { ButtonSecondary } from '@/components/Button/Button.style';
import type { ButtonProps } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

export const NavbarButtonsContainer = styled('div')({
  display: 'flex',
  flex: 1,
  justifySelf: 'self-end',
  justifyContent: 'flex-end',
});

export const MenuToggle = styled(ButtonSecondary)<ButtonProps>(({ theme }) => {
  return ({
  justifyContent: 'center',
  backgroundColor: 'transparent',
  color:
    (theme.vars || theme).palette.accent1Alt.main,
  width: 48,
  borderRadius: '50%',
  marginLeft: theme.spacing(1.5),
  minWidth: 'unset',
  height: 48,
  ':hover:before': {
    backgroundColor: alpha(theme.palette.white.main, 0.12),
    ...theme.applyStyles("light", {
      backgroundColor: (theme.vars || theme).palette.alphaDark100.main
    })
  },
  ':hover': {
    backgroundColor: 'transparent',
  },
  ...theme.applyStyles("light", {
    color: (theme.vars || theme).palette.primary.main
  })
})});
