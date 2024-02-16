import type { Breakpoint } from '@mui/material';
import { Box, Container } from '@mui/material';

import { styled } from '@mui/material/styles';

export const BlogArticleImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: theme.breakpoints.values.xl,
  textAlign: 'center',
  padding: theme.spacing(2),
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    margin: theme.spacing(0, 8),
  },
}));

export const BlogArticleImage = styled('img')(({ theme }) => ({
  width: '100%',
  borderRadius: '16px',
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    maxWidth: theme.breakpoints.values.lg,
  },
}));

export const BlogAuthorAvatar = styled('img')(({ theme }) => ({
  width: '64px !important',
  height: '64px',
  marginRight: theme.spacing(3),
  borderRadius: '32px',
}));

export const BlogArticleContainer = styled(Container)(({ theme }) => ({
  margin: 'auto',
  background: 'transparent',
  borderRadius: '8px',
  position: 'relative',
  width: '100% !important',
  overflow: 'hidden',
  // boxShadow:
  //   theme.palette.mode === 'dark'
  //     ? '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.08)'
  //     : '0px 2px 4px rgba(0, 0, 0, 0.04), 0px 8px 16px rgba(0, 0, 0, 0.04)',

  // padding: theme.spacing(1, 2, 3),
  padding: theme.spacing(1.5, 2, 3),

  ':first-of-type': {
    marginTop: theme.spacing(6),
  },

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(1.5, 3, 3),
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    padding: theme.spacing(1.5, 3, 3),
    maxWidth: `${theme.breakpoints.values.md}px`,
  },
}));

export const BlogArticleContentContainer = styled(Box)(({ theme }) => ({
  margin: 'auto',
  marginTop: theme.spacing(4),
  img: {
    width: '100%',
  },

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(4, 'unset'),
    maxWidth: '100%',
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    margin: theme.spacing(8, 'auto'),
    maxWidth: '100%',
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    maxWidth: theme.breakpoints.values.md,
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    maxWidth: theme.breakpoints.values.md,
  },
}));
