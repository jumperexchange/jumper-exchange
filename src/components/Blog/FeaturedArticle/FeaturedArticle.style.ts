import { urbanist } from '@/fonts/fonts';
import type { BoxProps, Breakpoint, TypographyProps } from '@mui/material';
import { Box, Skeleton, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import Image from 'next/image';
import Link from 'next/link';

export const FeaturedArticleLink = styled(Link)<BoxProps>(({ theme }) => ({
  position: 'relative',
  borderRadius: 32,
  backgroundColor: theme.palette.bgSecondary.main,
  transition: 'background-color 250ms',
  boxShadow: theme.palette.shadow.main,
  display: 'grid',
  gridTemplateRows: '1fr',
  textDecoration: 'none',
  flexDirection: 'column',
  padding: theme.spacing(2),
  margin: theme.spacing(4, 2, 0),
  '&:hover': {
    cursor: 'pointer',
    backgroundColor:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.white.main, 0.8)
        : alpha(theme.palette.white.main, 0.2),
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(6, 8, 0),
    padding: theme.spacing(3),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: theme.spacing(4),
  },

  [theme.breakpoints.up('lg' as Breakpoint)]: {
    padding: theme.spacing(8),
    minHeight: 500,
    gap: theme.spacing(8),
    gridTemplateRows: '1fr',
    gridTemplateColumns: '54% 1fr',
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    margin: theme.spacing(6, 'auto', 0),
    maxWidth: theme.breakpoints.values.xl,
    minHeight: 600,
  },
}));

export const FeaturedArticleMetaContainer = styled(Box)<BoxProps>(
  ({ theme }) => ({
    display: 'flex',
    fontSize: '16px',
    color: theme.palette.text.primary,
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      marginTop: 0,
      marginLeft: theme.spacing(3),
    },
    [theme.breakpoints.up('lg' as Breakpoint)]: {
      marginTop: 0,
    },
  }),
);

export const FeaturedArticleMetaDate = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontSize: 'inherit',
    '&:after': {
      content: '"•"',
      margin: '0 4px',
    },
  }),
);

export const FeaturedArticleImage = styled(Image)(({ theme }) => ({
  borderRadius: '20px',
  userSelect: 'none',
  alignSelf: 'flex-start',
  width: '100%',
  height: 'auto',
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    borderRadius: '14px',
    alignSelf: 'center',
    boxShadow:
      theme.palette.mode === 'light'
        ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
        : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
  },
}));

export const FeaturedArticleImageSkeleton = styled(Skeleton)(({ theme }) => ({
  borderRadius: '14px',
  aspectRatio: 1.6,
  width: '100%',
  height: '100%',
  userSelect: 'none',
  transform: 'unset',
  alignSelf: 'flex-start',
  boxShadow:
    theme.palette.mode === 'light'
      ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
      : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
  [theme.breakpoints.up('md' as Breakpoint)]: {
    alignSelf: 'center',
  },
}));

export const FeaturedArticleTagSkeleton = styled(Skeleton)(({ theme }) => ({
  height: '48px',
  width: '108px',
  borderRadius: '24px',
  transform: 'unset',
}));

export const FeaturedArticleMetaSkeleton = styled(Skeleton)(({ theme }) => ({
  height: 16,
  width: 150,
  borderRadius: 8,
  transform: 'unset',
  marginTop: theme.spacing(2),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginTop: 0,
    marginLeft: theme.spacing(3),
  },
}));

export const FeaturedArticleTitleSkeleton = styled(Skeleton)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  transform: 'unset',
  width: '100%',
  height: 112,
  borderRadius: '12px',
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    margin: theme.spacing(4, 0),

    height: 112,
  },
}));

export const FeaturedArticleSubtitleSkeleton = styled(Skeleton)(
  ({ theme }) => ({
    height: '64px',
    transform: 'unset',
    borderRadius: '12px',
  }),
);

export const FeaturedArticleContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.text.primary,
  // color: theme.palette.mode === 'light' ? '#525252' : lighten('#525252', 0.8), //todo: add to theme
  flexDirection: 'column',
  alignSelf: 'center',
  justifyContent: 'flex-end',
  paddingBottom: theme.spacing(2),
  margin: theme.spacing(3, 0),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    padding: theme.spacing(2),
    paddingTop: 0,
    margin: theme.spacing(4, 0),
    marginBottom: 0,
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    padding: 0,
    margin: theme.spacing(4, 0),
    marginBottom: 0,
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    margin: theme.spacing(0),
  },
}));

export const FeaturedArticleDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  fontWeight: 400,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  [theme.breakpoints.up('lg' as Breakpoint)]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export const FeaturedArticleTitle = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    userSelect: 'none',
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3),
    overflow: 'hidden',
    fontFamily: urbanist.style.fontFamily,
    lineHeight: '40px',
    fontSize: '40px',
    fontWeight: 700,
    maxHeight: 168,
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',

    [theme.breakpoints.up('sm' as Breakpoint)]: {
      fontSize: '48px',
      lineHeight: '56px',
      marginTop: theme.spacing(2),
    },
    [theme.breakpoints.up('md' as Breakpoint)]: {
      marginTop: theme.spacing(4),
    },
  }),
);

export const FeaturedArticleSubtitle = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    userSelect: 'none',
    fontSize: '18px',
    lineHeight: '32px',
    overflow: 'hidden',
    maxHeight: 96,
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
  }),
);
