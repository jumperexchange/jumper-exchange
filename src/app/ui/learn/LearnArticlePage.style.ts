'use client';
import { Box, styled, type BoxProps } from '@mui/material';

export const BlogArticleWrapper = styled(Box)<BoxProps>(({ theme }) => ({
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
