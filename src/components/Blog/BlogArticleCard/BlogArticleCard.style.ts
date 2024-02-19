import { Card, Typography, darken, type Breakpoint } from '@mui/material';

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
  background:
    theme.palette.mode === 'light'
      ? theme.palette.white.main
      : theme.palette.alphaLight200.main,
  transition: 'background-color 250ms',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    minWidth: 250,
    width: 416,
  },
  '&:hover': {
    cursor: 'pointer',
    backgroundColor:
      theme.palette.mode === 'light'
        ? darken(theme.palette.white.main, 0.04)
        : theme.palette.alphaLight300.main,
  },
}));

export const BlogArticleCardImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  borderRadius: '16px',
  border: `1px solid ${getContrastAlphaColor(theme, '12%')}`,
  objectFit: 'cover',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    height: 240,
  },
}));

export const BlogArticleCardTitle = styled(Typography)(({ theme }) => ({
  color: 'inherit',
  marginTop: theme.spacing(1),
  fontWeight: 700, //todo: use typography
  fontSize: '24px',
  fontFamily: 'Urbanist, Inter',
  lineHeight: '32px',
  minHeight: '64px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  '-webkit-line-clamp': '2',
  '-webkit-box-orient': 'vertical',
}));

export const BlogArticleTagTitle = styled(Typography)(({ theme }) => ({
  color:
    theme.palette.mode === 'light'
      ? theme.palette.grey[800]
      : theme.palette.grey[300],
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '32px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
  height: '64px',
  ':not(:first-of-type)': {
    marginLeft: theme.spacing(0.5),
  },
}));
