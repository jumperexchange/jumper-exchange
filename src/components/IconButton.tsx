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
      theme.palette.alphaLight300.main,
    '&:hover': {
      backgroundColor: getContrastAlphaColor(theme, '8%'),
    },
    ...theme.applyStyles("light", {
      backgroundColor: theme.palette.white.main
    })
  }),
);

export const IconButtonPrimary = styled(IconButton)(({ theme }) => ({
  color: theme.palette.white.main,
  backgroundColor:
    theme.palette.primary.main,
  ':hover': {
    backgroundColor:
      darken(theme.palette.primary.main, 0.16),
    ...theme.applyStyles("light", {
      backgroundColor: darken(theme.palette.accent1.main, 0.16)
    })
  },
  ...theme.applyStyles("light", {
    backgroundColor: theme.palette.accent1.main
  })
}));

export const IconButtonSecondary = styled(IconButton)(({ theme }) => ({
  // todo add color to theme
  color: theme.palette.white.main,
  backgroundColor:
    theme.palette.alphaLight300.main,
  '&:hover': {
    backgroundColor: getContrastAlphaColor(theme, '4%'),
  },
  ...theme.applyStyles("light", {
    color: '#240752',
    backgroundColor: theme.palette.white.main
  })
}));

export const IconButtonAlpha = styled(IconButton)(({ theme }) => ({
  backgroundColor:
    theme.palette.alphaLight300.main,
  '&:hover': {
    backgroundColor:
      theme.palette.alphaLight500.main,
    ...theme.applyStyles("light", {
      backgroundColor: theme.palette.alphaDark300.main
    })
  },
  ...theme.applyStyles("light", {
    backgroundColor: theme.palette.alphaDark100.main
  })
}));
