import { CardContent, Skeleton, useTheme } from '@mui/material';
import { BlogArticleCardContainer } from '.';

export const BlogArticleCardSkeleton = () => {
  const theme = useTheme();
  return (
    <BlogArticleCardContainer>
      <Skeleton variant="rectangular" sx={{ width: 420, height: 236 }} />
      <CardContent
        sx={{
          ...(theme.palette.mode === 'dark' && {
            color: theme.palette.black.main,
          }),
        }}
      >
        <Skeleton variant="text" sx={{ width: 388, height: 24 }} />
      </CardContent>
    </BlogArticleCardContainer>
  );
};
