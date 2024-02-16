import type { Breakpoint, IconButtonProps } from '@mui/material';
import { Grid, IconButton } from '@mui/material';

import { styled } from '@mui/material/styles';
import { getContrastAlphaColor } from 'src/utils';

export const ArticlesGrid = styled(Grid)(({ theme }) => ({
  margin: theme.spacing(2, 'auto'),
  display: 'grid',
  marginTop: `calc(${theme.spacing(4)} + 56px + ${theme.spacing(6)} )`,
  paddingBottom: theme.spacing(12),
  gridTemplateColumns: '1fr',
  gap: theme.spacing(4),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    gridTemplateColumns: '1fr 1fr',
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    maxWidth: 'fit-content',
    gridTemplateColumns: '1fr 1fr 1fr',
  },
}));

export interface PaginationIndexButtonProps
  extends Omit<IconButtonProps, 'isDarkMode' | 'isWide' | 'component'> {
  active: boolean;
}

export const PaginationIndexButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<PaginationIndexButtonProps>(({ theme, active }) => ({
  ...(active
    ? {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[800]
            : theme.palette.grey[300],
      }
    : {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[800]
            : theme.palette.grey[400],
      }),
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
    backgroundColor:
      theme.palette.mode === 'dark'
        ? getContrastAlphaColor(theme, '12%')
        : getContrastAlphaColor(theme, '4%'),
  },
}));

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
