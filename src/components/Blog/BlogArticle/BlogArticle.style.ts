import type { Breakpoint, TypographyProps } from '@mui/material';
import {
  Box,
  Container,
  Divider as MuiDivider,
  Skeleton,
  Typography,
  alpha,
} from '@mui/material';

import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { urbanist } from 'src/fonts/fonts';

export const BlogArticleImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  color: alpha(theme.palette.white.main, 0.88),
  maxWidth: theme.breakpoints.values.xl,
  textAlign: 'center',
  padding: theme.spacing(2),
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    margin: theme.spacing(0, 'auto'),
  },
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.grey[800],
  }),
}));

export const BlogArticleTopHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '32px',
  color: alpha(theme.palette.white.main, 0.88),
  '*': { textWrap: 'nowrap' },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ...theme.applyStyles('light', {
    color: (theme.vars || theme).palette.grey[800],
  }),
}));

export const BlogArticleMetaSkeleton = styled(Skeleton)(({ theme }) => ({
  transform: 'unset',
  width: 164,
  height: 32,
  borderRadius: 16,
  marginTop: theme.spacing(1.5),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginLeft: theme.spacing(3),
    marginTop: theme.spacing(0),
  },
}));

export const BlogArticleHeaderTagSkeleton = styled(Skeleton)(({ theme }) => ({
  height: '48px',
  width: '120px',
  borderRadius: '24px',
  transform: 'unset',
}));

export const BlogArticleHeaderMeta = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginTop: theme.spacing(0),
  },
}));

export const BlogArticleHeaderMetaDate = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginLeft: theme.spacing(3),
  },
  '&:after': {
    content: '"•"',
    margin: theme.spacing(0, 1),
  },
}));

export const BlogArticleImage = styled(Image)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  borderRadius: '16px',
  maxWidth: theme.breakpoints.values.lg,
  aspectRatio: '16/12',
  objectFit: 'cover',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    aspectRatio: '15/8',
  },
}));

export const BlogArticleImageSkeleton = styled(Skeleton)(({ theme }) => ({
  width: '100%',
  height: 'auto',
  transform: 'unset',
  borderRadius: '16px',
  margin: theme.spacing(0, 'auto', 0.75),
  maxWidth: theme.breakpoints.values.lg,
  textAlign: 'center',
  aspectRatio: '16/12',
  objectFit: 'cover',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    aspectRatio: '15/8',
  },
}));

export const BlogAuthorAvatar = styled(Image)(({ theme }) => ({
  width: '64px !important',
  height: '64px',
  marginRight: theme.spacing(3),
  borderRadius: '32px',
}));

export const BlogAuthorAvatarSkeleton = styled(Skeleton)(({ theme }) => ({
  marginRight: theme.spacing(3),
  width: '64px',
  height: '64px',
  borderRadius: '32px',
  transform: 'unset',
}));

export const BlogArticleContainer = styled(Container)(({ theme }) => ({
  margin: 'auto',
  background: 'transparent',
  borderRadius: '8px',
  position: 'relative',
  width: '100% !important',
  overflow: 'hidden',
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
    [theme.breakpoints.up('sm' as Breakpoint)]: {
      marginTop: theme.spacing(6),
    },
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    maxWidth: `${theme.breakpoints.values.md}px`,
  },
}));

export const BlogArticleContentContainer = styled(Box)(({ theme }) => ({
  margin: 'auto',
  color: (theme.vars || theme).palette.text.secondary,
  marginTop: theme.spacing(4),
  img: {
    width: '100%',
  },
  '& a': {
    color: (theme.vars || theme).palette.accent1Alt.main,
    ...theme.applyStyles('light', {
      color: (theme.vars || theme).palette.primary.main,
    }),
  },
  '& li': {
    color: 'inherit',
  },
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    margin: theme.spacing(0, 'auto'),
    maxWidth: '100%',
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    margin: theme.spacing(0, 'auto'),
    maxWidth: '100%',
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    maxWidth: theme.breakpoints.values.md,
  },
  [theme.breakpoints.up('xl' as Breakpoint)]: {
    maxWidth: theme.breakpoints.values.md,
  },
}));

export const BlogArticleContentSkeleton = styled(Skeleton)(() => ({
  transform: 'unset',
  height: '5000px',
  width: '100%',
}));

export const BlogMetaContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  flexDirection: 'column',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginTop: theme.spacing(8),
    alignItems: 'center',
    flexDirection: 'row',
  },
}));

export const BlogAuthorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
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

export const BlogAuthorMetaWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  //todo: add to theme colors
  color: alpha(theme.palette.white.main, 0.88),
  ...theme.applyStyles('light', {
    color: '#525252',
  }),
}));

export const Divider = styled(MuiDivider)(({ theme }) => ({
  borderColor: alpha(theme.palette.white.main, 0.12),
  ...theme.applyStyles('light', {
    borderColor: alpha(theme.palette.black.main, 0.12),
  }),
  margin: theme.spacing(8, 0, 0),
}));

// Typography:

export const BlogArticleTitle = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.white.main, 0.88),
  marginTop: theme.spacing(4),
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    marginTop: theme.spacing(8),
  },
  ...theme.applyStyles('light', {
    color: alpha(theme.palette.black.main, 0.88),
  }),
}));

export const BlogArticleTitleSkeleton = styled(Skeleton)(({ theme }) => ({
  marginTop: theme.spacing(4),
  transform: 'unset',
  borderRadius: 16,
  height: 320,
  width: '100%',
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    height: '192px',
    marginTop: theme.spacing(8),
  },
  [theme.breakpoints.up('md' as Breakpoint)]: {
    height: 144,
  },
}));

export const BlogArticleSubtitle = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.white.main, 0.88),
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(6),
  fontWeight: 700,
  fontFamily: urbanist.style.fontFamily,
  fontSize: '28px',
  lineHeight: '40px',
  ...theme.applyStyles('light', {
    color: alpha(theme.palette.black.main, 0.88),
  }),
}));

export const BlogArticleSubtitleSkeleton = styled(Skeleton)(({ theme }) => ({
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(6),
  transform: 'unset',
  width: '100%',
  height: 300,
  [theme.breakpoints.up('sm' as Breakpoint)]: {
    height: 190,
  },
  [theme.breakpoints.up('lg' as Breakpoint)]: {
    height: 114,
  },
}));

export const BlogArticlAuthorName = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    color: alpha(theme.palette.white.main, 0.88),
    fontSize: '24px',
    lineHeight: '28px',
    fontWeight: 700,
    fontFamily: urbanist.style.fontFamily,
    ...theme.applyStyles('light', {
      color: (theme.vars || theme).palette.black.main,
    }),
  }),
);

export const BlogArticlAuthorNameSkeleton = styled(Skeleton)(({ theme }) => ({
  width: 142,
  height: 28,
  transform: 'unset',
}));

export const BlogArticlAuthorRole = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontSize: '16px',
    fontWeight: 400,
    marginTop: theme.spacing(0.5),
    lineHeight: '20px',
  }),
);

export const BlogArticlAuthorRoleSkeleton = styled(Skeleton)(({ theme }) => ({
  width: 220,
  height: 20,
  marginTop: theme.spacing(0.5),
  transform: 'unset',
}));

export const BlogParagraphContainer = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  '& a:not(:first-child)': {
    marginLeft: 0,
  },
}));
