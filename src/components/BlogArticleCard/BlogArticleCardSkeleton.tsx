import type { Breakpoint, CSSObject } from '@mui/material';
import { CardContent, Skeleton, useTheme } from '@mui/material';
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
    <BlogArticleCardContainer sx={containerStyles}>
      <Skeleton variant="rectangular" sx={{ ...imageStyles }} />
      <CardContent
        sx={{
          ...(theme.palette.mode === 'dark' && {
            color: theme.palette.black.main,
          }),
          ...contentStyles,
        }}
      >
        <Skeleton
          variant="text"
          sx={{
            width: '80%',
            height: 24,
            marginTop: 2,
            [theme.breakpoints.up('lg' as Breakpoint)]: {
              height: 48,
            },
            ...contentStyles,
          }}
        />
      </CardContent>
    </BlogArticleCardContainer>
  );
};
