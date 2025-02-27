'use client';
import type { Breakpoint } from '@mui/material';
import { Box, styled } from '@mui/material';

export const BlogArticleWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  ':before': {
    content: '" "',
    width: '100%',
    position: 'absolute',
    left: 0,
    zIndex: -1,
    right: 0,
    top: -200,
    bottom: 0,
    height: 'calc( 100% + 200px )',
    background: theme.palette.white.main,
  },
}));

export const BlogArticleSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6, 2, 0.25),
  position: 'relative',

  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(6, 2, 0.25),
    paddingTop: theme.spacing(12),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: theme.spacing(8, 0, 0.25),
    paddingTop: theme.spacing(12),
  },
}));
