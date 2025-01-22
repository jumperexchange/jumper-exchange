'use client';

import { ButtonSecondary } from '@/components/Button/Button.style';
import { getContrastAlphaColor } from '@/utils/colors';
import type { ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export const NavbarButtonsContainer = styled('div')({
  display: 'flex',
  flex: 1,
  justifySelf: 'self-end',
  justifyContent: 'flex-end',
});

export const MenuToggle = styled(ButtonSecondary)<ButtonProps>(({ theme }) => ({
  justifyContent: 'center',
  backgroundColor: 'transparent',
  color:
    theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.accent1Alt.main,
  width: 48,
  borderRadius: '50%',
  marginLeft: theme.spacing(1.5),
  minWidth: 'unset',
  height: 48,
  ':hover:before': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.alphaDark100.main
        : getContrastAlphaColor(theme, '12%'),
  },
  ':hover': {
    backgroundColor: 'transparent',
  },
}));
