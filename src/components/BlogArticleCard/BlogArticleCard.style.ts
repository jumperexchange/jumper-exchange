import type { CardProps } from '@mui/material';
import { Box, Card } from '@mui/material';

import { styled } from '@mui/material/styles';

export interface BlogArticleCardProps extends Omit<CardProps, 'component'> {
  // backgroundImageUrl?: string;
}

export const BlogArticleCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'backgroundImageUrl',
})<BlogArticleCardProps>(({ theme }) => ({
  width: '512px',
  '&:hover': {
    cursor: 'pointer',
  },
  '> *:not(img)': {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

export const BlogArticleImage = styled('img', {
  shouldForwardProp: (prop) => prop !== 'backgroundImageUrl',
})(({ theme }) => ({
  width: '100%',
}));

export const BlogArticleMeta = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'backgroundImageUrl',
})(({ theme }) => ({
  height: '32px',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  color: theme.palette.grey[500],
}));
