import MuiIconButton from '@mui/material/IconButton';
import { alpha, styled } from '@mui/material/styles';

export const IconButton = styled(MuiIconButton)(({ theme }) => ({
  color: alpha(theme.palette.white.main, 0.88),
  transition: 'background 0.3s',
  width: '48px',
  height: '48px',
  backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.alphaLight200.main,
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.alphaDark200.main,
    }),
  },
  ...theme.applyStyles('light', {
    color: alpha(theme.palette.black.main, 0.88),
    backgroundColor: (theme.vars || theme).palette.white.main,
  }),
}));

export const IconButtonPrimary = styled(IconButton)(({ theme }) => ({
  color: (theme.vars || theme).palette.white.main,
  backgroundColor: (theme.vars || theme).palette.primary.main,
  ':hover': {
    backgroundColor: `oklch(from ${(theme.vars || theme).palette.primary.main} calc(l - 0.1) c h)`,
    ...theme.applyStyles('light', {
      backgroundColor: `oklch(from ${(theme.vars || theme).palette.accent1.main} calc(l - 0.1) c h)`,
    }),
  },
  ...theme.applyStyles('light', {
    color: theme.palette.white.main,
    backgroundColor: (theme.vars || theme).palette.accent1.main,
  }),
}));

export const IconButtonSecondary = styled(IconButton)(({ theme }) => ({
  // todo add color to theme
  color: (theme.vars || theme).palette.white.main,
  backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.white.main, 0.04),
    ...theme.applyStyles('light', {
      backgroundColor: alpha(theme.palette.black.main, 0.04),
    }),
  },
  ...theme.applyStyles('light', {
    color: '#240752',
    backgroundColor: (theme.vars || theme).palette.white.main,
  }),
}));

export const IconButtonTertiary = styled(IconButton)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.alphaLight500.main,
    ...theme.applyStyles('light', {
      backgroundColor: (theme.vars || theme).palette.alphaDark300.main,
    }),
  },
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.alphaDark100.main,
  }),
}));
