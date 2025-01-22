import type { IconButtonProps } from '@mui/material';
import { Box, IconButton } from '@mui/material';

import { getContrastAlphaColor } from '@/utils/colors';
import { darken, lighten, styled } from '@mui/material/styles';

export const PaginationContainer = styled(Box)(({ theme }) => ({
  bottom: 0,
  width: 'fit-content',
  flexWrap: 'wrap',
  padding: theme.spacing(1),
  backgroundColor:
    theme.palette.mode === 'dark'
      ? getContrastAlphaColor(theme, '12%')
      : getContrastAlphaColor(theme, '4%'),
  borderRadius: '24px',
  left: '50%',
  margin: theme.spacing(2, 'auto', 0, 'auto'),
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
}));

export interface PaginationIndexButtonProps extends IconButtonProps {
  active: boolean;
}

export const PaginationIndexButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<PaginationIndexButtonProps>(({ theme, active }) => {
  let color =
    theme.palette.mode === 'light'
      ? lighten(theme.palette.text.primary, 0.4)
      : darken(theme.palette.text.primary, 0.2);

  if (active) {
    color =
      theme.palette.mode === 'light'
        ? lighten(theme.palette.text.primary, 0.2)
        : theme.palette.text.primary;
  }

  return {
    ...(active && {
      backgroundColor:
        theme.palette.mode === 'light'
          ? theme.palette.white.main
          : getContrastAlphaColor(theme, '12%'),
    }),
    color,
    width: 40,
    height: 40,
    ...(active && {
      '& .MuiTouchRipple-root': {
        backgroundColor:
          theme.palette.mode === 'light'
            ? theme.palette.alphaDark100.main
            : theme.palette.alphaLight300.main,
        zIndex: -1,
      },
    }),
    '&:hover': {
      color,
      backgroundColor:
        theme.palette.mode === 'light'
          ? getContrastAlphaColor(theme, '4%')
          : getContrastAlphaColor(theme, '32%'),
    },
  };
});

export const PaginationButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.grey[500],
  width: 40,
  height: 40,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? getContrastAlphaColor(theme, '12%')
        : getContrastAlphaColor(theme, '4%'),
  },
}));
