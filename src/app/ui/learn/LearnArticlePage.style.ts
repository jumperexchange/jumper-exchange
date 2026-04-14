'use client';
import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
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
    background: (theme.vars || theme).palette.white.main,
  },
}));

export const BlogArticleSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6, 2, 0.25),
  position: 'relative',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    paddingTop: theme.spacing(12),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: theme.spacing(8, 3, 0.25),
    paddingTop: theme.spacing(12),
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    padding: theme.spacing(8, 0, 0.25),
    paddingTop: theme.spacing(12),
  },
}));

export const LearnPageArticlesFilteringBarContainer = styled(Box)(
  ({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: theme.shape.cardBorderRadius,
    boxShadow: theme.shadows[2],
    backgroundColor: (theme.vars || theme).palette.surface1.main,
    border: getSurfaceBorder(theme, 'surface1'),
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3),
    },
  }),
);
