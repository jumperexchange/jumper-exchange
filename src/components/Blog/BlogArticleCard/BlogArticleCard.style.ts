import {
  Card,
  CardContent,
  Typography,
  darken,
  type Breakpoint,
} from '@mui/material';

import { styled } from '@mui/material/styles';
import { Tag } from 'src/components/Tag.style';
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

export const BlogArticleCardContent = styled(CardContent)(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(2),
  '&:last-child': { paddingBottom: theme.spacing(1) },
}));

export const BlogArticleCardTitle = styled(Typography)(({ theme }) => ({
  color: 'inherit',
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

export const BlogArticleTag = styled(Tag)(({ theme }) => ({
  // color:
  //   theme.palette.mode === 'light'
  //     ? theme.palette.grey[800]
  //     : theme.palette.grey[300],
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: '18px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '50%',
  height: '40px',
  ':not(:first-of-type)': {
    marginLeft: theme.spacing(0.5),
  },
}));
