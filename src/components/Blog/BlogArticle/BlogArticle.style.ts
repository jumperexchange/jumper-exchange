import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import {
  Box,
  Container,
  Divider as MuiDivider,
  Typography,
  alpha,
} from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

import { HeaderHeight } from '@/const/headerHeight';

export interface BlogArticleTocScrollAlignmentOpts {
  scrollHidesAppBar: boolean;
}

export const getContentContainerStylesForTOC = (theme: Theme) => ({
  position: 'relative',
  display: 'grid',
  width: '100%',
  gridTemplateColumns: '1fr',
  overflow: 'visible',
  [theme.breakpoints.up('md')]: {
    maxWidth: 'none !important',
    gridTemplateColumns: `1fr min(${theme.breakpoints.values.sm}px, 100%) 1fr`,
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 'none !important',
    gridTemplateColumns: `1fr min(${theme.breakpoints.values.md}px, 100%) 1fr`,
  },
});

export const getTOCStyles = (
  theme: Theme,
  opts: BlogArticleTocScrollAlignmentOpts,
) => ({
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'block',
    justifySelf: 'end',
    width: 'auto',
    maxWidth: 240,
    pr: 2,
    boxSizing: 'border-box',
    position: 'sticky',
    top: opts.scrollHidesAppBar
      ? theme.spacing(2)
      : `calc(${HeaderHeight.MD}px + ${theme.spacing(2)})`,
    alignSelf: 'start',
    transition: theme.transitions.create('top', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
});

export const BaseBlogArticleSkeleton = styled(BaseSurfaceSkeleton)({
  transform: 'unset',
});

export const BlogArticleContainer = styled(Container)(({ theme }) => ({
  margin: 'auto',
  background: 'transparent',
  borderRadius: '8px',
  position: 'relative',
  width: '100% !important',
  padding: theme.spacing(1.5, 2, 3),
  li: {
    color: alpha(theme.palette.text.primary, 0.75),
    margin: theme.spacing(0.5, 0),
    fontSize: '18px',
    lineHeight: '32px',
    fontWeight: 400,
  },
  ':first-of-type': {
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(6),
    },
  },
  [theme.breakpoints.up('md')]: {
    maxWidth: `${theme.breakpoints.values.sm}px`,
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: `${theme.breakpoints.values.md}px`,
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: `${theme.breakpoints.values.lg}px`,
  },
}));

export const BlogArticleContentContainer = styled(Box)(({ theme }) => ({
  margin: 'auto',
  color: (theme.vars || theme).palette.text.secondary,
  marginTop: theme.spacing(4),
  minWidth: 0,
  width: '100%',
  '& > img': {
    width: '100%',
  },
  '& a:not(.MuiIconButton-root)': {
    color: (theme.vars || theme).palette.accent1Alt.main,
    ...theme.applyStyles('light', {
      color: (theme.vars || theme).palette.primary.main,
    }),
  },
  '& li': {
    color: 'inherit',
  },
  [theme.breakpoints.up('sm')]: {
    margin: theme.spacing(0, 'auto'),
    maxWidth: '100%',
  },
  [theme.breakpoints.up('md')]: {
    maxWidth: theme.breakpoints.values.sm,
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: theme.breakpoints.values.md,
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: theme.breakpoints.values.lg,
  },
}));

export const BlogArticleImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  color: alpha(theme.palette.white.main, 0.88),
  maxWidth: theme.breakpoints.values.xl,
  textAlign: 'center',
  padding: theme.spacing(2),
  [theme.breakpoints.up('xl')]: {
    margin: theme.spacing(0, 'auto'),
  },
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.grey[800],
  }),
}));

export const BlogArticleImage = styled(Image)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  borderRadius: theme.shape.cardBorderRadiusMedium,
  maxWidth: theme.breakpoints.values.md,
  aspectRatio: '16/12',
  objectFit: 'cover',
  [theme.breakpoints.up('sm')]: {
    aspectRatio: '15/8',
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: theme.breakpoints.values.lg,
  },
}));

export const BlogArticleImageSkeleton = styled(BaseBlogArticleSkeleton)(
  ({ theme }) => ({
    width: '100%',
    height: 'auto',
    borderRadius: theme.shape.cardBorderRadiusMedium,
    margin: theme.spacing(0, 'auto', 0.75),
    maxWidth: theme.breakpoints.values.lg,
    aspectRatio: '16/12',
    objectFit: 'cover',
    [theme.breakpoints.up('sm')]: {
      aspectRatio: '15/8',
    },
  }),
);

export const BlogArticleTopHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '32px',
  color: alpha(theme.palette.white.main, 0.88),
  '*': { textWrap: 'nowrap' },
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.grey[800],
  }),
}));

export const BlogArticleHeaderTagSkeleton = styled(BaseBlogArticleSkeleton)(
  ({ theme }) => ({
    height: '48px',
    width: '120px',
    borderRadius: theme.shape.cardBorderRadiusLarge,
  }),
);

export const BlogArticleHeaderMeta = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  [theme.breakpoints.up('sm')]: {
    marginTop: 0,
  },
}));

export const BlogArticleHeaderMetaDate = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
  },
  '&:after': {
    content: '"•"',
    margin: theme.spacing(0, 1),
  },
}));

export const BlogArticleMetaSkeleton = styled(BaseBlogArticleSkeleton)(
  ({ theme }) => ({
    width: 164,
    height: 32,
    borderRadius: theme.shape.cardBorderRadiusMedium,
    marginTop: theme.spacing(1.5),
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      marginTop: 0,
    },
  }),
);

export const BlogArticleTitle = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.white.main, 0.88),
  marginTop: theme.spacing(4),
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(8),
  },
  ...theme.applyStyles('light', {
    color: alpha(theme.palette.black.main, 0.88),
  }),
}));

export const BlogArticleTitleSkeleton = styled(BaseBlogArticleSkeleton)(
  ({ theme }) => ({
    marginTop: theme.spacing(4),
    borderRadius: theme.shape.cardBorderRadiusMedium,
    height: 320,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      height: 192,
      marginTop: theme.spacing(8),
    },
    [theme.breakpoints.up('md')]: {
      height: 144,
    },
  }),
);

export const BlogArticleSubtitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.h4,
  color: alpha(theme.palette.white.main, 0.88),
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(6),
  ...theme.applyStyles('light', {
    color: alpha(theme.palette.black.main, 0.88),
  }),
}));

export const BlogArticleSubtitleSkeleton = styled(BaseBlogArticleSkeleton)(
  ({ theme }) => ({
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(6),
    width: '100%',
    height: 300,
    [theme.breakpoints.up('sm')]: { height: 190 },
    [theme.breakpoints.up('lg')]: { height: 114 },
  }),
);

export const BlogArticleContentSkeleton = styled(BaseBlogArticleSkeleton)({
  height: 'clamp(480px, 60vh, 1200px)',
  width: '100%',
});

export const BlogMetaContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(8),
    alignItems: 'center',
    flexDirection: 'row',
  },
}));

export const BlogAuthorAvatar = styled(Image)(({ theme }) => ({
  borderRadius: theme.shape.radius32,
}));

export const BlogAuthorWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: theme.spacing(6, 0),
  padding: theme.spacing(0.5),
  paddingRight: theme.spacing(1.5),
  width: 'fit-content',
  borderRadius: '20px',
}));

export const Divider = styled(MuiDivider)(({ theme }) => ({
  borderColor: alpha(theme.palette.white.main, 0.12),
  ...theme.applyStyles('light', {
    borderColor: alpha(theme.palette.black.main, 0.12),
  }),
  marginTop: theme.spacing(2),
}));
