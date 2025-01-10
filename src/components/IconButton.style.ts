import { getContrastAlphaColor } from '@/utils/colors';
import type { IconButtonProps } from '@mui/material';
import { IconButton as MuiIconButtom, darken, styled } from '@mui/material';

export const IconButton = styled(MuiIconButtom, {
  shouldForwardProp: (prop) => prop !== 'styles',
})(({ theme }) => ({
  color: getContrastAlphaColor(theme, '84%'),
  transition: 'background 0.3s',
  width: '48px',
  height: '48px',
  backgroundColor: theme.palette.alphaLight300.main,
  '&:hover': {
    backgroundColor: getContrastAlphaColor(theme, '8%'),
  },
  ...theme.applyStyles('light', {
    backgroundColor: theme.palette.white.main,
  }),
}));

export const IconButtonPrimary = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<IconButtonProps>(({ theme }) => ({
  color: theme.palette.white.main,
  backgroundColor: theme.palette.accent1.main,
  ':hover': {
    backgroundColor: darken(theme.palette.accent1.main, 0.16),
    ...theme.applyStyles('dark', {
      backgroundColor: darken(theme.palette.primary.main, 0.16),
    }),
  },
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.primary.main,
  }),
}));

export const IconButtonSecondary = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<IconButtonProps>(({ theme }) => ({
  // todo add color to theme
  color: theme.palette.white.main,
  backgroundColor: theme.palette.white.main,
  '&:hover': {
    backgroundColor: getContrastAlphaColor(theme, '4%'),
  },
  ...theme.applyStyles('light', {
    color: '#240752',
  }),
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.alphaLight300.main,
  }),
}));

export const IconButtonTertiary = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'styles',
})(({ theme }) => ({
  backgroundColor: theme.palette.alphaDark100.main,
  '&:hover': {
    backgroundColor: theme.palette.alphaDark300.main,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.alphaLight500.main,
    }),
  },
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.alphaLight300.main,
  }),
}));

export const SuperfestIconButtonPrimary = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'styles',
})<IconButtonProps>(({ theme }) => ({
  color: theme.palette.white.main,
  backgroundColor: theme.palette.accent1.main,
  ':hover': {
    backgroundColor: darken(theme.palette.accent1.main, 0.16),
    ...theme.applyStyles('dark', {
      backgroundColor: darken(theme.palette.primary.main, 0.16),
    }),
  },
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.primary.main,
  }),
}));
