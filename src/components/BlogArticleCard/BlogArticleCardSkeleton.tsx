import type { CSSObject } from '@mui/material';
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
      <Skeleton
        variant="rectangular"
        sx={{ width: 420, height: 236, borderRadius: '16px', ...imageStyles }}
      />
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
          sx={{ width: 388, height: 24, ...contentStyles }}
        />
      </CardContent>
    </BlogArticleCardContainer>
  );
};
