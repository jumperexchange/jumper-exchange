import type { Breakpoint, CSSObject } from '@mui/material';
import { CardContent, Skeleton, useTheme } from '@mui/material';
import { getContrastAlphaColor } from 'src/utils';
import { BlogArticleCardContainer } from '.';

interface BlogArticleCardSkeletonProps {
  imageStyles?: CSSObject;
  contentStyles?: CSSObject;
  containerStyles?: CSSObject;
}

export const BlogArticleCardSkeleton = ({
  imageStyles,
  contentStyles,
  containerStyles,
}: BlogArticleCardSkeletonProps) => {
  const theme = useTheme();
  return (
    <BlogArticleCardContainer
      sx={{
        flexShrink: 0,
        width: '100%',
        border: 'unset',
        boxShadow: 'unset',
        paddingBottom: 0,
        borderRadius: '32px',
        transition: 'unset',
        [theme.breakpoints.up('sm' as Breakpoint)]: {
          minWidth: 250,
          width: 416,
        },
        ...containerStyles,
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{
          width: '100%',
          height: '216px',
          borderRadius: '16px',
          border: `1px solid ${getContrastAlphaColor(theme, '12%')}`,
          aspectRatio: 1.6,
          ...imageStyles,
        }}
      />
      <CardContent
        sx={{
          padding: theme.spacing(3, 0),
          ...(theme.palette.mode === 'dark' && {
            color: theme.palette.black.main,
          }),
          width: '100%',
          '&:last-child': { paddingBottom: 0 },
          [theme.breakpoints.up('sm' as Breakpoint)]: {
            // width: 230,
            height: 176,
          },
          [theme.breakpoints.up('xl' as Breakpoint)]: {
            // width: 230,
            height: 176,
          },
          ...contentStyles,
        }}
      >
        <Skeleton
          variant="text"
          sx={{
            width: '64px',
            height: 24,
            [theme.breakpoints.up('lg' as Breakpoint)]: {
              height: 48,
            },
          }}
        />
        <Skeleton
          variant="text"
          sx={{
            width: '100%',
            height: '64px',
            transform: 'unset',
          }}
        />
        <Skeleton
          variant="text"
          sx={{
            width: '150px',
            height: '24px',
            transform: 'unset',
            marginTop: theme.spacing(2),
          }}
        />
      </CardContent>
    </BlogArticleCardContainer>
  );
};
