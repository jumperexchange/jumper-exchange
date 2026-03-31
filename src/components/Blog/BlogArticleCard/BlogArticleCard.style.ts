import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import {
  Box,
  Card,
  CardContent,
  Typography,
  type Breakpoint,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { urbanist } from 'src/fonts/fonts';

export const BlogArticleCardContainer = styled(Card)(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  width: 'min(416px, calc(100vw - 64px))',
  minWidth: 0,
  maxWidth: 416,
  border: getSurfaceBorder(theme, 'surface1'),
  padding: theme.spacing(2),
  borderRadius: theme.shape.cardBorderRadiusXLarge,
  background: (theme.vars || theme).palette.surface1.main,
  transition: 'background-color 250ms',
  boxShadow: (theme.vars || theme).shadows[2],
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    minWidth: 250,
    width: 416,
  },
  '&:hover': {
    cursor: 'pointer',
    backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.surface1.main} 96%, white 4%)`,
    ...theme.applyStyles('light', {
      backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.surface1.main} 96%, black 4%)`,
    }),
  },
}));

export const BlogArticleCardDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column-reverse',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: '100%',
  marginTop: theme.spacing(2),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    flexDirection: 'row',
  },
}));

export const BlogArticleCardImage = styled(Image)(({ theme }) => ({
  display: 'block',
  width: '100%',
  maxWidth: '100%',
  height: 'auto',
  borderRadius: theme.shape.cardBorderRadiusMedium,
  objectFit: 'cover',
  aspectRatio: 1.6,
  objectPosition: 'left',
}));

export const BlogArticleCardImageSkeleton = styled(BaseSurfaceSkeleton)(
  ({ theme }) => ({
    width: '100%',
    aspectRatio: 1.6,
    transform: 'unset',
    height: 'auto',
    borderRadius: theme.shape.cardBorderRadiusMedium,
  }),
);

export const BlogArticleCardContent = styled(CardContent)(({ theme }) => ({
  minWidth: 0,
  margin: 0,
  padding: theme.spacing(2),
  '&:last-child': { paddingBottom: theme.spacing(1) },
}));

export const BlogArticleCardTitle = styled(Typography)(({ theme }) => ({
  width: '100%',
  minWidth: 0,
  color: 'inherit',
  fontWeight: 700, //todo: use typography
  fontSize: '24px',
  fontFamily: urbanist.style.fontFamily,
  lineHeight: '32px',
  minHeight: '64px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
}));

export const BlogArticleCardTitleSkeleton = styled(BaseSurfaceSkeleton)(
  ({ theme }) => ({
    width: '100%',
    height: '64px',
    transform: 'unset',
    borderRadius: '12px',
    minHeight: '64px',
  }),
);
