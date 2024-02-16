import { Card, darken, type Breakpoint } from '@mui/material';

import { styled } from '@mui/material/styles';
import { getContrastAlphaColor } from 'src/utils';

export const BlogArticleCardContainer = styled(Card)(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  border: 'unset',
  padding: theme.spacing(2),
  borderRadius: '32px',
  background: theme.palette.white.main,
  transition: 'background-color 250ms',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    minWidth: 250,
    width: 416,
  },
  '&:hover': {
    cursor: 'pointer',
    backgroundColor: darken(theme.palette.white.main, 0.04),
  },
}));

export const BlogArticleCardImage = styled('img')(({ theme }) => ({
  width: '100%',
  borderRadius: '16px',
  height: 240,
  border: `1px solid ${getContrastAlphaColor(theme, '12%')}`,
}));
