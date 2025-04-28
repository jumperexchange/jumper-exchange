import type { IconButtonProps } from '@mui/material';
import { alpha, Box, IconButton } from '@mui/material';

import { darken, lighten, styled } from '@mui/material/styles';

export const PaginationContainer = styled(Box)(({ theme }) => ({
  bottom: 0,
  width: 'fit-content',
  flexWrap: 'wrap',
  padding: theme.spacing(1),
  backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
  borderRadius: '24px',
  left: '50%',
  margin: theme.spacing(2, 'auto', 0, 'auto'),
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(2),
  ...theme.applyStyles("light", {
    backgroundColor: (theme.vars || theme).palette.alphaDark100.main
  })
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
    backgroundColor: (theme.vars || theme).alphaLight600.main,
    ...theme.applyStyles("light", {
      backgroundColor: theme.palette.alphaDark100.main
    })
  },
  variants: [
    {
      props: ({ active }) => active,
      style: {
        backgroundColor: alpha(theme.palette.white.main, 0.12),
        color: (theme.vars || theme).palette.text.primary,
        ...theme.applyStyles("light", {
          backgroundColor: (theme.vars || theme).palette.white.main,
          color: lighten(theme.palette.black.main, 0.2),
        }),
        '& .MuiTouchRipple-root': {
          backgroundColor: (theme.vars || theme).palette.alphaLight300.main,
          zIndex: -1,
          ...theme.applyStyles("light", {
            backgroundColor: (theme.vars || theme).palette.alphaDark200.main,
          }),
        },
        '&:hover': {
          color: (theme.vars || theme).palette.text.primary,
          ...theme.applyStyles("light", {
            color: lighten(theme.palette.text.primary, 0.2),
          }),
        },
      },
    },
    {
      props: ({ active }) => !active,
      style: {
        color: darken(theme.palette.white.main, 0.2),
        ...theme.applyStyles("light", {
          color: lighten(theme.palette.black.main, 0.4),
        }),
        '&:hover': {
          color: darken(theme.palette.white.main, 0.2),
          ...theme.applyStyles("light", {
            color: lighten(theme.palette.black.main, 0.4),
          }),
        },
      },
    },
  ],
}));

export const PaginationButton = styled(IconButton)(({ theme }) => ({
  color: (theme.vars || theme).palette.grey[500],
  width: 40,
  height: 40,
  '&:hover': {
    backgroundColor: alpha(theme.palette.white.main, 0.12),
    ...theme.applyStyles("light", {
      backgroundColor: (theme.vars || theme).palette.alphaDark100.main
    })
  },
}));
