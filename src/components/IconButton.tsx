import { getContrastAlphaColor } from '@/utils/colors';
import type { IconButtonProps } from '@mui/material';
import { IconButton as MuiIconButtom, darken, styled } from '@mui/material';

export const IconButton = styled(MuiIconButtom)<IconButtonProps>(
  ({ theme }) => ({
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
  }),
);

export const IconButtonPrimary = styled(IconButton)(({ theme }) => ({
  color: theme.palette.white.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.accent1.main
      : theme.palette.primary.main,
  ':hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? darken(theme.palette.accent1.main, 0.16)
        : darken(theme.palette.primary.main, 0.16),
  },
}));

export const IconButtonSecondary = styled(IconButton)(({ theme }) => ({
  color: theme.palette.mode === 'light' ? '#240752' : theme.palette.white.main, // todo add color to theme
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.white.main
      : theme.palette.alphaLight300.main,
  '&:hover': {
    backgroundColor: getContrastAlphaColor(theme, '4%'),
  },
}));

export const IconButtonAlpha = styled(IconButton)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.alphaDark100.main
      : theme.palette.alphaLight300.main,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? theme.palette.alphaDark300.main
        : theme.palette.alphaLight500.main,
  },
}));
