import { getContrastAlphaColor } from '@/utils/colors';
import {
  IconButton as MuiIconButtom,
  alpha,
  darken,
  styled,
} from '@mui/material';

export const IconButton = styled(MuiIconButtom)(({ theme }) => ({
  color: alpha(theme.palette.white.main, 0.88),
  transition: 'background 0.3s',
  width: '48px',
  height: '48px',
  backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.white.main, 0.08),
    ...theme.applyStyles('light', {
      backgroundColor: alpha(theme.palette.black.main, 0.08),
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
    backgroundColor: darken(theme.palette.primary.main, 0.16),
    ...theme.applyStyles('light', {
      backgroundColor: darken(theme.palette.accent1.main, 0.16),
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

export const SuperfestIconButtonPrimary = styled(IconButton)(({ theme }) => ({
  color: (theme.vars || theme).palette.white.main,
  backgroundColor: (theme.vars || theme).palette.primary.main,
  ':hover': {
    backgroundColor: darken(theme.palette.primary.main, 0.16),
    ...theme.applyStyles('light', {
      backgroundColor: darken(theme.palette.accent1.main, 0.16),
    }),
  },
  ...theme.applyStyles('light', {
    backgroundColor: (theme.vars || theme).palette.accent1.main,
  }),
}));
