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
    theme.palette.mode === 'light'
      ? getContrastAlphaColor(theme, '4%')
      : getContrastAlphaColor(theme, '12%'),
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
})<PaginationIndexButtonProps>(({ theme }) => ({
  width: 40,
  height: 40,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? getContrastAlphaColor(theme, '4%')
        : getContrastAlphaColor(theme, '32%'),
  },
  variants: [
    {
      props: ({ active }) => active,
      style: {
        backgroundColor:
          theme.palette.mode === 'light'
            ? theme.palette.white.main
            : getContrastAlphaColor(theme, '12%'),
        color:
          theme.palette.mode === 'light'
            ? lighten(theme.palette.text.primary, 0.2)
            : theme.palette.text.primary,
        '& .MuiTouchRipple-root': {
          backgroundColor:
            theme.palette.mode === 'light'
              ? theme.palette.alphaDark100.main
              : theme.palette.alphaLight300.main,
          zIndex: -1,
        },
        '&:hover': {
          color:
            theme.palette.mode === 'light'
              ? lighten(theme.palette.text.primary, 0.2)
              : theme.palette.text.primary,
        },
      },
    },
    {
      props: ({ active }) => !active,
      style: {
        color:
          theme.palette.mode === 'light'
            ? lighten(theme.palette.text.primary, 0.4)
            : darken(theme.palette.text.primary, 0.2),
        '&:hover': {
          color:
            theme.palette.mode === 'light'
              ? lighten(theme.palette.text.primary, 0.4)
              : darken(theme.palette.text.primary, 0.2),
        },
      },
    },
  ],
}));

export const PaginationButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.grey[500],
  width: 40,
  height: 40,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? getContrastAlphaColor(theme, '4%')
        : getContrastAlphaColor(theme, '12%'),
  },
}));
