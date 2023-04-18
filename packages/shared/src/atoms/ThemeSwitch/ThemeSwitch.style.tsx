import IconButton from '@mui/material/IconButton';
import type { Breakpoint } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { getContrastAlphaColor } from '../../utils';

export const ButtonThemeSwitch = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  display: 'none',
  width: '48px',
  height: '48px',
  marginLeft: theme.spacing(3),
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.alphaLight300.main
      : theme.palette.white.main,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.alphaLight300.main
        : theme.palette.white.main,
  },
  '&:hover:before': {
    content: '" "',
    position: 'absolute',
    borderRadius: '50%',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    transition: 'background-color 250ms',
    background: getContrastAlphaColor(theme, '4%'),
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    display: 'flex',
  },
}));
