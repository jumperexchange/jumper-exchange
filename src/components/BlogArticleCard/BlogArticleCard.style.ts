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
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 4px 8px rgba(0, 0, 0, 0.16)',
  '&:hover': {
    cursor: 'pointer',
    transform: 'scale(1.005)',
    boxShadow:
      theme.palette.mode === 'dark'
        ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
        : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
  },
  '> *:not(img)': {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

export const BlogArticleCardImage = styled('img', {
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
