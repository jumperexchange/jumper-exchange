import type { Breakpoint } from '@mui/material';
import { Box, Container, type CardProps } from '@mui/material';

import { styled } from '@mui/material/styles';

export interface BlogArticleProps extends Omit<CardProps, 'component'> {
  // backgroundImageUrl?: string;
}

export const BlogArticleImage = styled('img', {
  shouldForwardProp: (prop) => prop !== 'backgroundImageUrl',
})(({ theme }) => ({
  borderRadius: '14px',
  width: '100%',
  marginTop: theme.spacing(1),
}));

export const BlogAuthorAvatar = styled('img')(({ theme }) => ({
  width: '28px',
  height: '28px',
  marginRight: theme.spacing(1),
  borderRadius: '14px',
}));

export const BlogArticleContainer = styled(Container)(({ theme }) => ({
  margin: 'auto',
  marginTop: theme.spacing(2),
  padding: theme.spacing(1, 2, 3),
  background: theme.palette.surface1.main,
  borderRadius: '8px',
  position: 'relative',
  maxWidth: theme.breakpoints.values.md,
  width: '100% !important',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.04)',

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    width: theme.breakpoints.values.md,
    maxWidth: theme.breakpoints.values.md,
  },
}));

export const BlogArticleContentContainer = styled(Box)(({ theme }) => ({
  margin: 'auto',
  marginTop: theme.spacing(4),
  maxWidth: theme.breakpoints.values.sm,
  img: {
    width: '100%',
  },

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(4, 'unset'),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    margin: theme.spacing(8, 'auto'),
  },
}));
