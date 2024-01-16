import type { Breakpoint, CardProps } from '@mui/material';
import { Box, Card } from '@mui/material';

import { styled } from '@mui/material/styles';

export interface BlogArticleCardProps extends Omit<CardProps, 'component'> {
  // backgroundImageUrl?: string;
}

export const BlogArticleCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'backgroundImageUrl',
})<BlogArticleCardProps>(({ theme }) => ({
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
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },

  // [theme.breakpoints.up('sm' as Breakpoint)]: {
  //   paddingLeft: theme.spacing(4),
  //   paddingRight: theme.spacing(4),
  // },

  [theme.breakpoints.up('md' as Breakpoint)]: {
    width: 512,
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
  flexShrink: 0,
  // marginTop: theme.spacing(1),
  marginRight: theme.spacing(1.5),
  color: theme.palette.grey[500],
  marginTop: theme.spacing(0.5),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    width: '50%',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(0),
    textAlign: 'right',
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    width: 'auto',
  },
}));

export const BlogTagsOverlay = styled('span')(({ theme }) => ({
  position: 'sticky',
  width: 12,
  // marginLeft: theme.spacing(-1.5),
  zIndex: 1,
  height: 'auto',
  right: 0,
  background: 'linear-gradient(90deg, transparent 0%,  #fff 100%)',
  [theme.breakpoints.up('sm' as Breakpoint)]: {},
}));
