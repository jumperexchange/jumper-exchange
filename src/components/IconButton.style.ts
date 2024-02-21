import type { IconButtonProps } from '@mui/material';
import {
  IconButton as MuiIconButtom,
  darken,
  lighten,
  styled,
} from '@mui/material';
import { getContrastAlphaColor } from 'src/utils';

export const IconButton = styled(MuiIconButtom, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<IconButtonProps>(({ theme }) => ({
  color: getContrastAlphaColor(theme, '84%'),
  transition: 'background 0.3s',
  width: '48px',
  height: '48px',
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.white.main
      : theme.palette.alphaLight300.main,
  '&:hover': {
    backgroundColor: getContrastAlphaColor(theme, '8%'),
  },
}));

export const IconButtonPrimary = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<IconButtonProps>(({ theme }) => ({
  color: '#240752', // todo add color to theme
  backgroundColor: '#E7D6FF', //todo: add to theme
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? darken('#E7D6FF', 0.04)
        : lighten('#E7D6FF', 0.4),
  },
}));

export const IconButtonSecondary = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<IconButtonProps>(({ theme }) => ({
  color: '#240752', // todo add color to theme
  backgroundColor: theme.palette.white.main, //todo: add to theme

  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
  '&:before': {
    content: '" "',
    position: 'absolute',
    borderRadius: '24px',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    transition: 'background 250ms',
    background: 'transparent',
  },
  '&:hover:before': {
    background: getContrastAlphaColor(theme, '8%'),
  },
}));

export const IconButtonTransparent = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<IconButtonProps>(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.alphaLight300.main
      : theme.palette.alphaDark100.main,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.alphaLight500.main
        : theme.palette.alphaDark300.main,
  },
}));
