import { Card, type Breakpoint } from '@mui/material';

import { lighten, styled } from '@mui/material/styles';

export const BlogArticleCardContainer = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'backgroundImageUrl',
})(({ theme }) => ({
  flexShrink: 0,
  width: '100%',
  border: 'unset',
  padding: theme.spacing(1),
  borderRadius: '24px',
  background: 'transparent',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    minWidth: 250,
    width: 420,
  },
  '&:hover': {
    cursor: 'pointer',
    background: lighten(theme.palette.grey[200], 0.5),
  },
}));

export const BlogArticleCardImage = styled('img', {
  shouldForwardProp: (prop) => prop !== 'backgroundImageUrl',
})(({ theme }) => ({
  width: '100%',
  borderRadius: '16px',
  border: `1px solid ${theme.palette.grey[300]}`,
}));
