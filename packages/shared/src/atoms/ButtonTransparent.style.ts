import { alpha, styled } from '@mui/material/styles';
import { getContrastAlphaColor } from '../utils';
import { ButtonBase } from './ButtonBase.style';

export const ButtonTransparent = styled(ButtonBase)(({ theme }) => ({
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.white.main
      : theme.palette.black.main,
  overflow: 'hidden',
  backgroundColor:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.white.main, 0.12)
      : alpha(theme.palette.black.main, 0.08),
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.white.main, 0.16)
        : alpha(theme.palette.black.main, 0.12),
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
