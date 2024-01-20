import type { ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ButtonSecondary } from 'src/components/Button/Button.style';
import { getContrastAlphaColor } from 'src/utils';

export const NavbarButtonsContainer = styled('div')({
  display: 'flex',
  justifySelf: 'self-end',
});

export const MenuToggle = styled(ButtonSecondary)<ButtonProps>(({ theme }) => ({
  justifyContent: 'center',
  backgroundColor: 'transparent',
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.accent1Alt.main
      : theme.palette.primary.main,
  width: 48,
  borderRadius: '50%',
  marginLeft: theme.spacing(1.5),
  minWidth: 'unset',
  height: 48,
  ':hover:before': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? getContrastAlphaColor(theme, '4%')
        : theme.palette.alphaDark100.main,
  },
  ':hover': {
    backgroundColor: 'transparent',
  },
}));
