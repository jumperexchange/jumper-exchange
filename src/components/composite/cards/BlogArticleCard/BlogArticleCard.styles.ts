import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

export const BlogArticleCardContainer = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1.5, 3, 1.5, 1.5),
  background: (theme.vars || theme).palette.surface1.main,
  borderRadius: theme.shape.cardBorderRadiusMedium,
  boxShadow: theme.shadows[2],
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
  alignItems: 'center',
  width: '100%',
}));

export const BlogArticleCardImage = styled(Image)(({ theme }) => ({
  width: 116,
  height: 72,
  borderRadius: theme.shape.cardBorderRadiusMedium,
  objectFit: 'cover',
  aspectRatio: 1.6,
  objectPosition: 'left',
}));

export const BlogArticleCardContentContainer = styled(Stack)(
  ({ theme }) => ({}),
);

export const BlogArticleCardHighlightText = styled(Typography)(({ theme }) => ({
  '& span': {
    position: 'relative',
    zIndex: 1,
  },
  '& mark': {
    background: 'transparent',
    color: (theme.vars || theme).palette.accent1Alt.main,

    position: 'relative',
    isolation: 'isolate',

    '&::before': {
      content: '""',
      position: 'absolute',
      width: `calc(100% + ${theme.spacing(0.5)})`,
      height: '100%',
      left: theme.spacing(-0.25),
      top: 0,
      background: (theme.vars || theme).palette.surface1ActiveAccent,
      zIndex: -1,
    },
  },
}));
